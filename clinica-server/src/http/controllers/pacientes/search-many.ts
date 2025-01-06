import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";

export async function searchMany(request: FastifyRequest, reply: FastifyReply) {
	try {
		const pacientes = await prisma.pacientes.findMany();
		reply.send(pacientes);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao listar pacientes' });
	}
}
