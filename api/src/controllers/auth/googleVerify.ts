import {FastifyReply, FastifyRequest, RouteGenericInterface} from "fastify";
import {OAuth2Client} from 'google-auth-library';
import {prisma} from '../../db';
import {tokenizeUser} from "../../helpers/tokenize";
import {config} from "../../config";

export interface GoogleVerifyRouteGeneric extends RouteGenericInterface {
    Body: { credential: string }
}
export const googleVerify = async (
    req: FastifyRequest<GoogleVerifyRouteGeneric>,
    reply: FastifyReply,
) => {
    try {
        console.log("credential", req.body.credential);
        const client = new OAuth2Client({
            clientId: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET
        });
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: config.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log("payload", payload);
        if (!payload) return reply.notFound('No payload');
        if (!payload.email) return reply.notFound(`User without email`)

        let user = await prisma.users.findUnique({
            where: {
                email: payload.email
            }
        })

        if (!user) {
            user = await prisma.users.create({
                data: {
                    email: payload.email,
                    fullName: payload.name ?? '',
                    avatar: payload.picture??'',
                }
            })
        }

        if (user.avatar !== payload.picture) {
            user.avatar = payload.picture ?? ''
            await prisma.users.update({
                where: {id: user.id},
                data: {avatar: payload.picture}
            })
        }

        return reply.send({
            user: {
                id: user.id,
                email: user.email,
                avatar: user.avatar,
                fullName: user.fullName,
                roles: user.roles,
                language: user.language,
                defaultLanguageToLearn: user.defaultLanguageToLearn,
                createdAt: user.createdAt,
            },
            token: tokenizeUser(user)
        });
    } catch (e) {
        console.log("err", e);
        throw e;
    }
}