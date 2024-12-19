import { FastifyReply, FastifyRequest } from "fastify";
import { farmacosParams } from "./farmacos.types";
import { prisma } from "../../../lib/prisma";

export async function deleteFarmaco(request: FastifyRequest<{ Params: farmacosParams }>, reply: FastifyReply) {
	const { id } = request.params;

	try {
		await prisma.farmacos.delete({
			where: { id },
		});

		reply.status(204).send();
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao apagar fármaco' });
	}
}
