import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";

export async function searchMany(request: FastifyRequest, reply: FastifyReply) {
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
