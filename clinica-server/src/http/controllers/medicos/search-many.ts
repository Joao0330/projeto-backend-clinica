import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";

export async function searchMany(request: FastifyRequest, reply: FastifyReply) {
	try {
		const medicos = await prisma.medicos.findMany();
		reply.send(medicos);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao listar medicos' });
	}
}
