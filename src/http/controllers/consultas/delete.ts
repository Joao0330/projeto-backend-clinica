import { FastifyReply, FastifyRequest } from "fastify";
import { ConsultaParams } from "./consultas.types";
import { prisma } from "../../../lib/prisma";

export async function deleteConsulta(request: FastifyRequest<{ Params: ConsultaParams }>, reply: FastifyReply) {
	const { id_medico, id_consulta } = request.params;

	try {
		await prisma.consultas.delete({
			where: {
				id_medico_id_consulta: { id_medico, id_consulta },
			},
		});

		reply.status(204).send();
	} catch (err) {
		console.error(err);
		reply.status(500).send({ err: 'Erro ao apagar consulta' });
	}
}
