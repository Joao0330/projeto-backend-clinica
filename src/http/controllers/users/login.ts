import { FastifyReply, FastifyRequest } from 'fastify';
import { createLoginSchema } from '../../../schemas/users.schema';
import { prisma } from '../../../lib/prisma';
import { compare } from 'bcrypt';

export async function loginUser(request: FastifyRequest, reply: FastifyReply) {
	const { email, password } = createLoginSchema.parse(request.body);

	try {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user || !(await compare(password, user.password))) {
			return reply.status(401).send({ err: 'Email ou password incorretos' });
		}

		const token = await reply.jwtSign({ id: user.id, role: user.role });

		reply.status(200).send({ token });
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao fazer login' });
	}
}
