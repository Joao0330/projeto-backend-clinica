import { FastifyReply, FastifyRequest } from "fastify";
import { createReceitaSchema } from "../../../schemas/receitas.schema";
import { verifyConsultaExists } from "../../../lib/verify-consulta-exists";
import { verifyFarmacoExists } from "../../../lib/verify-farmaco-exists";
import { verifyFarmacoIsPrescripted } from "../../../lib/verify-farmaco-is-prescripted";
import { prisma } from "../../../lib/prisma";

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const { id_consulta_medico, id_consulta, id_farmaco } = createReceitaSchema.parse(request.body);

	try {
		// Verifica se a consulta existe
		if (!(await verifyConsultaExists(id_consulta, id_consulta_medico))) {
			return reply.status(404).send({ err: 'Consulta não encontrada' });
		}

		// Verifica se o farmaco existe
		if (!(await verifyFarmacoExists(id_farmaco))) {
			return reply.status(404).send({ err: 'Fármaco nao encontrado' });
		}

		// Verifica se o farmaco já foi receitado
		if (await verifyFarmacoIsPrescripted(id_consulta_medico, id_consulta, id_farmaco)) {
			return reply.status(409).send({ err: 'Fármaco ja foi receitado' });
		}

		// Cria receita
		const receita = await prisma.receita.create({
			data: {
				id_consulta_medico,
				id_consulta,
				id_farmaco,
			},
		});

		reply.status(201).send(receita);
	} catch (err) {
		reply.status(500).send({ error: 'Erro ao criar a receita.' });
	}
}
