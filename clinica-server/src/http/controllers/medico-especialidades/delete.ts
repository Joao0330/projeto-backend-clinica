import { FastifyReply, FastifyRequest } from "fastify";
import { medicoEspecialidadesParams } from "./medico-especialidades.types";
import { prisma } from "../../../lib/prisma";

export async function deleteMedicoEspecialidade(request: FastifyRequest<{ Params: medicoEspecialidadesParams }>, reply: FastifyReply) {
	const { id_medico, id_especialidade } = request.params;

	try {
		await prisma.medicoEspecialidades.delete({
			where: {
				id_medico_id_especialidade: {
					id_medico,
					id_especialidade,
				},
			},
		});

		reply.status(204).send();
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao remover associação entre médico e especialidade' });
	}
}