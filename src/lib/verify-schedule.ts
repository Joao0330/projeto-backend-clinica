import dayjs from "dayjs";
import { prisma } from "./prisma";
import { FastifyReply } from "fastify";

export async function verifySchedule(data_inicio: string, data_fim: string, id_medico: string, reply: FastifyReply) {
	if (!dayjs(data_inicio).isValid() || !dayjs(data_fim).isValid()) {
		return reply.status(400).send({ error: 'Datas inválidas.' });
	}

	// Verifica se a o horário requisitado está livre para o médico
	const consultaExistente = await prisma.consultas.findFirst({
		where: {
			id_medico,
			data_inicio: { lt: dayjs(data_fim).toDate() },
			data_fim: { gt: dayjs(data_inicio).toDate() },
		},
	});

	if (consultaExistente) {
		return reply.status(400).send({ error: 'Horário indisponível para o médico.' });
	}
}
