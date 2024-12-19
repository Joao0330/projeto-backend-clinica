import { FastifyReply, FastifyRequest } from "fastify";
import { receitasParams } from "./receitas.types";
import { prisma } from "../../../lib/prisma";

export async function deleteReceita(request: FastifyRequest<{ Params: receitasParams }>, reply: FastifyReply) {
	const { id_consulta_medico, id_consulta, id_farmaco } = request.params;

	try {
		await prisma.receita.delete({
			where: {
				id_consulta_medico_id_consulta_id_farmaco: {
					id_consulta_medico,
					id_consulta,
					id_farmaco,
				},
			},
		});

		reply.status(204).send();
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao apagar receita' });
	}
}
