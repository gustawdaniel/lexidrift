import fastify, {
    FastifyInstance, FastifyPluginOptions,
    FastifyReply,
    FastifyRequest, RouteShorthandOptions,
} from 'fastify';
import {config} from "./config";
import cors from '@fastify/cors';
import fastifySensible from '@fastify/sensible';
import {FastifyRouteConfig} from "fastify/types/route";
import jwt from 'jsonwebtoken';
import {router} from "./router";

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
    const payload = jwt.verify(token, config.JWT_SECRET) as TokenPayload;

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


export function getFastifyInstance(): FastifyInstance {
    const app = fastify({
        logger: config.NODE_ENV === 'development',
        bodyLimit: 100 * 1048576,
    });

    app.register(cors, {});
    app.register(fastifySensible);

    app.addContentTypeParser(
        ['video/mp4'],
        { parseAs: 'buffer' },
        (req, body, done) => {
            done(null, body)
        },
    )

    app.addHook(
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

    app.register(router);

    return app;
}