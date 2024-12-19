import { FastifyReply, FastifyRequest } from "fastify";
import { medicoParams } from "./medicos.types";
import { prisma } from "../../../lib/prisma";

export async function searchOne(request: FastifyRequest<{ Params: medicoParams }>, reply: FastifyReply) {
	const { id } = request.params;

	try {
		const medico = await prisma.medicos.findUnique({
			where: {
				id,
			},
		});

		if (!medico) {
			reply.status(404).send({ err: 'Medico nao encontrado' });
		}

		reply.send(medico);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao buscar medico' });
	}
}
