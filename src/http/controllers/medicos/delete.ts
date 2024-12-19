import { FastifyReply, FastifyRequest } from "fastify";
import { medicoParams } from "./medicos.types";
import { prisma } from "../../../lib/prisma";

export async function deleteMedico(request: FastifyRequest<{ Params: medicoParams }>, reply: FastifyReply) {
	const { id } = request.params;

	try {
		await prisma.medicos.delete({
			where: { id },
		});

		reply.status(204).send();
	} catch (err) {
		reply.status(500).send({ err: 'Médico não encontrado' });
	}
}
