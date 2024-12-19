import { FastifyReply, FastifyRequest } from "fastify";
import { receitasParams } from "./receitas.types";
import { prisma } from "../../../lib/prisma";

export async function searchByConsulta(request: FastifyRequest<{ Params: receitasParams }>, reply: FastifyReply) {
	const { id_consulta_medico, id_consulta } = request.params;

	try {
		const receitas = await prisma.receita.findMany({
			where: {
				id_consulta_medico,
				id_consulta,
			},
			include: {
				farmaco: true,
			},
		});

		if (receitas.length === 0) {
			return reply.status(404).send({ error: 'Nenhuma receita encontrada para esta consulta.' });
		}

		reply.send(receitas);
	} catch (err) {
		console.error(err);
		reply.status(500).send({ err: 'Erro ao buscar receitas' });
	}
}
