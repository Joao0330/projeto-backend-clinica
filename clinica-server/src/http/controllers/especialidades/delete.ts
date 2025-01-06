import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";
import { especialidadesParams } from "./especialidades.types";

export async function deleteEspecialidade(request: FastifyRequest<{ Params: especialidadesParams }>, reply: FastifyReply) {
	const { id } = request.params;

	try {
		await prisma.especialidades.delete({
			where: { id },
		});

		reply.status(204).send();
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao apagar especialidade' });
	}
}
