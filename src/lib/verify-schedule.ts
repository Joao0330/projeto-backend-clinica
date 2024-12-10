import dayjs from 'dayjs';
import { prisma } from './prisma';
import { FastifyReply } from 'fastify';

export async function verifySchedule(data_inicio: string, data_fim: string, id_medico: string): Promise<{ conflito: boolean; ocupado?: { inicio: Date; fim: Date } }> {
	if (!dayjs(data_inicio).isValid() || !dayjs(data_fim).isValid()) {
		throw new Error('Datas inválidas.');
	}

	// Verifica se a o horário requisitado está livre para o médico
	const consultaExistente = await prisma.consultas.findFirst({
		where: {
			id_medico,
			data_inicio: { lte: dayjs(data_fim).toDate() },
			data_fim: { gte: dayjs(data_inicio).toDate() },
		},
	});

	if (consultaExistente) {
		return {
			conflito: true,
			ocupado: {
				inicio: consultaExistente.data_inicio ?? new Date(),
				fim: consultaExistente.data_fim ?? new Date(),
			},
		};
	}

	return { conflito: false };
}
