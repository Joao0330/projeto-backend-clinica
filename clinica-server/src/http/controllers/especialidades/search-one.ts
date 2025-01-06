import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";
import { especialidadesParams } from "./especialidades.types";

export async function searchOne(request: FastifyRequest<{ Params: especialidadesParams }>, reply: FastifyReply) {
	const { id } = request.params;

	try {
		const especialidade = await prisma.especialidades.findUnique({
			where: {
				id,
			},
		});

		if (!especialidade) {
			return reply.status(404).send({ err: 'Especialidade não encontrada' });
		}

		reply.send(especialidade);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao buscar especialidade' });
	}
}
