import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { createConsultaSchema, updateConsultaSchema } from './consultas.schema';
import dayjs from 'dayjs';
import { verifySchedule } from '../../lib/verify-schedule';
import { verifySameNumeroConsulta } from '../../lib/verify-same-numero-consulta';

export async function getAllConsultas(request: FastifyRequest, reply: FastifyReply) {
	try {
		const consultas = await prisma.consultas.findMany({
			include: {
				medico: true,
				paciente: true,
				especialidade: true,
			},
		});

		reply.send(consultas);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao listar consultas' });
	}
}

export async function getConsulta(request: FastifyRequest<{ Params: { id_medico: string; id_consulta: string } }>, reply: FastifyReply) {
	const { id_medico, id_consulta } = request.params;

	try {
		const consulta = await prisma.consultas.findUnique({
			where: {
				id_medico_id_consulta: { id_medico, id_consulta },
			},
			include: {
				medico: true,
				paciente: true,
				especialidade: true,
			},
		});

		if (!consulta) {
			return reply.status(404).send({ err: 'Consulta nao encontrada' });
		}

		reply.send(consulta);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao buscar consulta' });
	}
}

export async function createConsulta(request: FastifyRequest, reply: FastifyReply) {
	const { id_medico, id_paciente, id_especialidade, numero_consulta, data_inicio, data_fim } = createConsultaSchema.parse(request.body);

	try {
		if (await verifySchedule(data_inicio, data_fim, id_medico, reply)) {
			return reply.status(400).send({ error: 'Horário indisponível para o médico.' });
		} else if(await verifySameNumeroConsulta(numero_consulta)) {
			return reply.status(409).send({ err: 'O numero de consulta já existe' });
		};

		const consulta = await prisma.consultas.create({
			data: {
				id_medico,
				id_paciente,
				id_especialidade,
				numero_consulta,
				data_inicio: dayjs(data_inicio).toDate(),
				data_fim: dayjs(data_fim).toDate(),
			},
		});

		reply.status(201).send(consulta);
	} catch (err) {
		reply.status(422).send({ err: 'Erro ao criar consulta' });
	}
}

export async function updateConsulta(request: FastifyRequest<{ Params: { id_medico: string; id_consulta: string } }>, reply: FastifyReply) {
	const { id_medico, id_consulta } = request.params;
	const { data_inicio, data_fim } = updateConsultaSchema.parse(request.body);

	if (data_inicio === undefined || data_fim === undefined) {
		return reply.status(400).send({ error: 'Datas inválidas.' });
	}

	try {
		if (await verifySchedule(data_inicio, data_fim, id_medico, reply)) {
			return reply.status(400).send({ error: 'Horário indisponível para o médico.' });
		}

		const consulta = await prisma.consultas.update({
			where: {
				id_medico_id_consulta: { id_medico, id_consulta },
			},
			data: {
				data_inicio: dayjs(data_inicio).toDate(),
				data_fim: dayjs(data_fim).toDate(),
			},
		});

		reply.send(consulta);
	} catch (err) {
		console.error('Error updating consulta:', err);
		reply.status(422).send({ err: 'Erro ao atualizar consulta' });
	}
}

export async function deleteConsulta(request: FastifyRequest<{ Params: { id_medico: string; id_consulta: string } }>, reply: FastifyReply) {
	const { id_medico, id_consulta } = request.params;

	try {
		await prisma.consultas.delete({
			where: {
				id_medico_id_consulta: { id_medico, id_consulta },
			},
		});

		reply.status(204).send();
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao apagar consulta' });
	}
}
