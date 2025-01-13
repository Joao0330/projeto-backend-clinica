import { prisma } from '@/src/lib/prisma';
import { FastifyReply, FastifyRequest } from 'fastify';
import { usersParams } from './users.types';

export async function getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
	try {
		const { id: userId } = request.user;

		if (!userId) {
			return reply.status(401).send({ error: 'Não autenticado' });
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				nome: true,
				email: true,
				role: true,
				contacto: true,
				morada: true,
			},
		});

		if (!user) {
			return reply.status(404).send({ error: 'Utilizador não encontrado' });
		}

		reply.status(200).send(user);
	} catch (err) {
		console.error(err);
		reply.status(500).send({ err: 'Erro ao buscar utilizador' });
	}
}
