import { FastifyReply, FastifyRequest } from 'fastify';
import { createConsultaSchema } from '../../../schemas/consultas.schema';
import dayjs from 'dayjs';
import { prisma } from '../../../lib/prisma';
import { verifyPacienteExists } from '../../../lib/verify-paciente-exists';
import { verifyMedicoExists } from '../../../lib/verify-medico-exists';
import { verifyEspecialidadeMedico } from '../../../lib/verify-medico-especialidade';
import { verifySchedule } from '../../../lib/verify-schedule';
import { createNumeroConsulta } from '../../../lib/create-numero-consulta';

export async function create(request: FastifyRequest, reply: FastifyReply) {
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
				return reply.status(403).send({ err: 'O usuário não possui um paciente registrado' });
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

		const especialidadeValida = await verifyEspecialidadeMedico(id_medico, id_especialidade);
		if (!especialidadeValida) {
			return reply.status(400).send({ error: 'A especialidade informada não pertence ao médico selecionado.' });
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
