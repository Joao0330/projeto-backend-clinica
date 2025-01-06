import { FastifyReply, FastifyRequest } from "fastify";
import { medicoEspecialidadesParams } from "./medico-especialidades.types";
import { prisma } from "../../../lib/prisma";

export async function searchByMedico(request: FastifyRequest<{ Params: medicoEspecialidadesParams }>, reply: FastifyReply) {
	const { id_medico } = request.params;

	try {
		const medicoEspecialidades = await prisma.medicoEspecialidades.findMany({
			where: {
				id_medico: id_medico,
			},
			include: {
				especialidade: {
					select: {
						designacao: true,
					},
				},
			},
		});

		if (medicoEspecialidades.length === 0) {
			return reply.status(404).send({ err: 'Nenhuma especialidade encontrada para este médico' });
		}

		reply.status(200).send(medicoEspecialidades);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao buscar especialidades do médico' });
	}
}
