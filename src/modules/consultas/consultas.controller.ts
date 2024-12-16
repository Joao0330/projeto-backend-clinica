import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { createConsultaSchema, updateConsultaSchema } from './consultas.schema';
import dayjs from 'dayjs';
import { verifySchedule } from '../../lib/verify-schedule';
import { createNumeroConsulta } from '../../lib/create-numero-consulta';
import { verifyMedicoExists } from '../../lib/verify-medico-exists';
import { verifyPacienteExists } from '../../lib/verify-paciente-exists';

export interface ConsultaParams {
	id_medico: string;
	id_consulta: string;
}

export async function getAllConsultas(request: FastifyRequest, reply: FastifyReply) {
	const { role, id: userId } = request.user;

	try {
		let consultas;

		if (role === 'ADMIN') {
			consultas = await prisma.consultas.findMany({
				include: {
					medico: true,
					paciente: true,
					especialidade: true,
				},
			});
		} else if (role === 'MEDICO') {
			const medico = await prisma.user.findUnique({
				where: { id: userId },
				select: {
					medicoId: true,
				},
			});

			consultas = await prisma.consultas.findMany({
				where: {
					id_medico: medico?.medicoId ?? undefined,
				},
				include: {
					paciente: true,
					especialidade: true,
				},
			});
		} else if (role === 'UTENTE') {
			const user = await prisma.user.findUnique({
				where: { id: userId },
				select: { pacienteId: true },
			});

			if (!user?.pacienteId) {
				return reply.status(403).send({ error: 'Usuário não está associado a um paciente válido.' });
			}

			consultas = await prisma.consultas.findMany({
				where: {
					id_paciente: user.pacienteId,
				},
				include: {
					medico: {
						select: {
							nome: true,
						},
					},
					especialidade: true,
				},
			});
		} else {
			return reply.status(403).send({ err: 'Acesso não permitido' });
		}

		reply.send(consultas);
	} catch (err) {
		console.error(err);
		reply.status(500).send({ err: 'Erro ao listar consultas' });
	}
}

// **Criação de consultas (ADMIN ou pacientes)**
export async function createConsulta(request: FastifyRequest, reply: FastifyReply) {
	const { role, id: userId } = request.user;
	const { id_medico, id_paciente, id_especialidade, data_inicio, data_fim } = createConsultaSchema.parse(request.body);

	try {
		// Validação para evitar marcações em datas passadas
		const now = dayjs();
		if (dayjs(data_inicio).isBefore(now) || dayjs(data_fim).isBefore(now)) {
			return reply.status(400).send({ error: 'Consultas só podem ser marcadas para datas futuras.' });
		}

		let pacienteId: string | undefined;

		if (role === 'UTENTE') {
			const user = await prisma.user.findUnique({
				where: { id: userId },
				select: {
					pacienteId: true,
				},
			});

			if (!user?.pacienteId) {
				return reply.status(403).send({ err: 'Usuario nao possui paciente' });
			}
			pacienteId = user.pacienteId;
		} else if (role === 'ADMIN') {
			if (!id_paciente) {
				return reply.status(400).send({ err: 'O id do paciente é obrigatório!' });
			}
			pacienteId = id_paciente;
		} else {
			return reply.status(403).send({ err: 'Sem permissão' });
		}

		if (!(await verifyPacienteExists(pacienteId))) {
			return reply.status(404).send({ err: 'Paciente não encontrado' });
		}

		if (!(await verifyMedicoExists(id_medico))) {
			return reply.status(404).send({ err: 'Médico não encontrado' });
		}

		const disponibilidade = await verifySchedule(data_inicio, data_fim, id_medico);

		if (disponibilidade.conflito) {
			return reply.status(400).send({
				error: 'Horário indisponível para o médico.',
				ocupado: disponibilidade.ocupado,
			});
		}

		const numeroConsulta = await createNumeroConsulta(id_medico);

		const consulta = await prisma.consultas.create({
			data: {
				id_medico,
				id_paciente: pacienteId,
				id_especialidade,
				numero_consulta: numeroConsulta,
				data_inicio: dayjs(data_inicio).toDate(),
				data_fim: dayjs(data_fim).toDate(),
			},
		});

		reply.status(201).send(consulta);
	} catch (err) {
		reply.status(422).send({ err: 'Erro ao criar consulta' });
	}
}

// **Update de consultas (ADMIN ou MEDICOS)**
export async function updateConsulta(request: FastifyRequest<{ Params: ConsultaParams }>, reply: FastifyReply) {
	const { role, id: userId } = request.user;
	const { id_medico, id_consulta } = request.params;
	const { data_inicio, data_fim } = updateConsultaSchema.parse(request.body);

	if (data_inicio === undefined || data_fim === undefined) {
		return reply.status(400).send({ error: 'Datas inválidas.' });
	}

	try {
		const consulta = await prisma.consultas.findUnique({
			where: {
				id_medico_id_consulta: { id_medico, id_consulta },
			},
		});

		const medico = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				medicoId: true,
			},
		});

		if (!consulta) {
			return reply.status(404).send({ error: 'Consulta não encontrada.' });
		}

		if (role === 'MEDICO' && consulta.id_medico !== medico?.medicoId) {
			return reply.status(403).send({ err: 'Você não tem permissão para editar esta consulta.' });
		}

		const disponibilidade = await verifySchedule(data_inicio, data_fim, id_medico);

		if (disponibilidade.conflito) {
			return reply.status(400).send({
				err: 'Horário indisponível para o médico.',
				ocupado: disponibilidade.ocupado,
			});
		}

		const consultaAtualizada = await prisma.consultas.update({
			where: {
				id_medico_id_consulta: { id_medico, id_consulta },
			},
			data: {
				data_inicio: dayjs(data_inicio).toDate(),
				data_fim: dayjs(data_fim).toDate(),
			},
		});

		reply.send(consultaAtualizada);
	} catch (err) {
		reply.status(422).send({ err: 'Erro ao atualizar consulta' });
	}
}

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
