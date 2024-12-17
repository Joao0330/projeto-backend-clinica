import { FastifyReply, FastifyRequest } from 'fastify';
import { createReceitaSchema } from './receitas.schema';
import { prisma } from '../../lib/prisma';
import { verifyConsultaExists } from '../../lib/verify-consulta-exists';
import { verifyFarmacoExists } from '../../lib/verify-farmaco-exists';
import { verifyFarmacoIsPrescripted } from '../../lib/verify-farmaco-is-prescripted';

export interface receitasParams{
	id_consulta_medico: string;
	id_consulta: string;
	id_farmaco: string;
}

export async function createReceita(request: FastifyRequest, reply: FastifyReply) {
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

export async function getReceitaByConsulta(request: FastifyRequest<{ Params: receitasParams }>, reply: FastifyReply) {
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
