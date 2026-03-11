import {FastifyReply, FastifyRequest} from "fastify";
import pJson from "../../../package.json";

export function version(_req: FastifyRequest, res: FastifyReply): void {
    res.code(200).send({
        name: pJson.name,
        version: pJson.version,
    });
};