import {ImageResponse, ImageSelector, InputAdapter} from "../../ports/io.port";
import cors from '@fastify/cors'
import {FastifyRequest, FastifyReply} from 'fastify';
import Fastify from 'fastify'
import {StorageAdapter} from "../../ports/storage.port";
import {getImageStyle} from "./cli";
import { imaginePicture } from "../../core/imagine";
import {LoggerAdapter} from "../../ports/logger.port";
import {FastifyRouteConfig} from "fastify/types/route";
import fastifySensible from '@fastify/sensible';
import jwt from 'jsonwebtoken';
import {config} from "../../core/config";

interface TokenPayload {
    sub: string,
    email: string,
    iss: string,
    role: string[],
    exp: number
    iat: number,
}

interface UserProjection {
    id: string
}

declare module 'fastify' {
    interface FastifyRequest {
        user: UserProjection | null;
    }
}

export function verifyToken(token: string):  UserProjection {
    const payload = jwt.verify(token, config.jwtSecret) as TokenPayload;

    return {
        id: payload.sub,
    }
}

function isProtected(config: FastifyRouteConfig): boolean {
    return (
        Boolean('isProtected' in config && config.isProtected)
    );
}


function getErrorMessage(error: unknown): string {
    if(error instanceof Error) {
        return error.message;
    }
    return 'Unknown error';
}

export class ApiAdapter implements InputAdapter {
    private readonly storage: StorageAdapter;
    private readonly logger: LoggerAdapter

    constructor(options: {
        storage: StorageAdapter
        logger: LoggerAdapter
    }) {
        this.storage = options.storage;
        this.logger = options.logger;
    }

    async imaginePicture(request: ImageSelector): Promise<ImageResponse> {
        return await imaginePicture(request.prompt, getImageStyle(request.style), {storage: this.storage, logger: this.logger});
    }

    async startServer(port: number) {
        const fastify = Fastify({logger: true});
        await fastify.register(cors, {});
        fastify.register(fastifySensible);

        fastify.addHook(
            'onRequest',
            async (
                request: FastifyRequest<{ Headers: { authorization?: string } }>,
                reply: FastifyReply,
            ) => {
                // If the route is not private we ignore this hook
                if (isProtected(request.routeOptions.config)) {
                    const authHeader = request.headers.authorization;
                    if (typeof authHeader !== 'string') {
                        reply.unauthorized('No Authorization header');
                        return;
                    }
                    const token: string = String(authHeader)
                        .replace(/^Bearer\s+/, '')
                        .trim();
                    if (!token) {
                        reply.unauthorized('Token is empty');
                        return;
                    }

                    try {
                        request.user = verifyToken(token);
                    } catch (error) {
                        return reply.unauthorized(getErrorMessage(error));
                    }
                }
            },
        );

        fastify.post('/imagine', async (req: FastifyRequest<{ Body: ImageSelector }>, reply: FastifyReply) => {
            const request = req.body;
            const response = await this.imaginePicture(request);
            reply.status(response.success ? 200 : 400).send(response);
        })

        fastify.get('/', async (_req: FastifyRequest, reply: FastifyReply) => {
            reply.status(200).send('Imagify API 0.0.1');
        });

        fastify.listen({host: '0.0.0.0', port}, (err: Error| null, address: string) => {
            if (err) {
                fastify.log.error(err);
                process.exit(1);
            }
            fastify.log.info(`API server running at ${address}`);
        });
    }
}

export async function startApiServer(options: {
    storage: StorageAdapter, logger: LoggerAdapter
}) {
    const adapter = new ApiAdapter(options);
    adapter.startServer(5000);
}