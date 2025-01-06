import { FastifyReply, FastifyRequest } from "fastify";
import { farmacosParams } from "./farmacos.types";
import { prisma } from "../../../lib/prisma";

export async function searchOne(request: FastifyRequest<{ Params: farmacosParams }>, reply: FastifyReply) {
	const { id } = request.params;

	try {
		const farmaco = await prisma.farmacos.findUnique({
			where: {
				id,
			},
		});

		if (!farmaco) {
			return reply.status(404).send({ err: 'Fármaco nao encontrado' });
		}

		reply.send(farmaco);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao buscar fármaco' });
	}
}
