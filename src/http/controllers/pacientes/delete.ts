import { FastifyReply, FastifyRequest } from "fastify";
import { pacientesParams } from "./pacientes.types";
import { prisma } from "../../../lib/prisma";

export async function deletePaciente(request: FastifyRequest<{ Params: pacientesParams }>, reply: FastifyReply) {
	const { id } = request.params;

	try {
		await prisma.pacientes.delete({
			where: { id },
		});

		reply.status(204).send();
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao apagar paciente' });
	}
}
