import dayjs from 'dayjs';
import { prisma } from './prisma';
import { FastifyReply } from 'fastify';

export async function verifySchedule(data_inicio: string, data_fim: string, id_medico: string, reply: FastifyReply): Promise<boolean> {
	if (!dayjs(data_inicio).isValid() || !dayjs(data_fim).isValid()) {
		reply.status(400).send({ error: 'Datas inválidass.' });
		return true;
	}

	// Verifica se a o horário requisitado está livre para o médico
	const consultaExistente = await prisma.consultas.findFirst({
		where: {
			id_medico,
			data_inicio: { lte: dayjs(data_fim).toDate() },
			data_fim: { gte: dayjs(data_inicio).toDate() },
		},
	});

	return consultaExistente !== null;
}
