import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";

export async function searchMany(request: FastifyRequest, reply: FastifyReply) {
	try {
		const especialidades = await prisma.especialidades.findMany();
		reply.send(especialidades);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao listar especialidades' });
	}
}
