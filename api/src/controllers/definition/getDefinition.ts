// import {FastifyReply, FastifyRequest, RouteGenericInterface} from "fastify";
// import {Language} from "@prisma/client";
// import {z} from "zod";
// import {prisma} from "../../db";
//
// export interface SingleWordDefinitionRouteGeneric extends RouteGenericInterface {
//     Params: {
//         word: string,
//         lang: Language,
//     }
// }
//
// const definitionSelectorModel = z.object({
//     lang: z.nativeEnum(Language),
//     word: z.string(),
// });
//
// export async function getDefinition(req: FastifyRequest<SingleWordDefinitionRouteGeneric>, reply: FastifyReply) {
//     const whereQuery = definitionSelectorModel.parse(req.params);
//
//     // TODO: change to findUnique
//     const definition = await prisma.definitions.findFirst({
//         where: {
//             word: whereQuery.word,
//             lang: whereQuery.lang,
//         },
//     });
//
//     if (!definition) {
//         return reply.notFound();
//     }
//
//     return definition;
// }
