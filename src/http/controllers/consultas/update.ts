import { FastifyReply, FastifyRequest } from 'fastify';
import { ConsultaParams } from './consultas.types';
import { updateConsultaSchema } from '../../../schemas/consultas.schema';
import { prisma } from '../../../lib/prisma';
import { verifySchedule } from '../../../lib/verify-schedule';
import dayjs from 'dayjs';

export async function update(request: FastifyRequest<{ Params: ConsultaParams }>, reply: FastifyReply) {
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
