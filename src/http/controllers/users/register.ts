import { FastifyReply, FastifyRequest } from 'fastify';
import { createRegisterSchema } from '../../../schemas/users.schema';
import { verifyUserExists } from '../../../lib/verify-user-exists';
import { verifyContact } from '../../../lib/verify-contact';
import { hash } from 'bcrypt';
import { prisma } from '../../../lib/prisma';

export async function registerUser(request: FastifyRequest, reply: FastifyReply) {
	const newUser = createRegisterSchema.parse(request.body);

	try {
		if (await verifyUserExists(newUser.email)) {
			return reply.status(409).send({ error: 'E-mail já cadastrado' });
		}
		if (newUser.contacto !== undefined && (await verifyContact(newUser.contacto, 'pacientes'))) {
			return reply.status(409).send({ err: 'Contacto ja cadastrado' });
		}

		const hashedPassword = await hash(newUser.password, 6);

		const user = await prisma.user.create({
			data: {
				nome: newUser.nome,
				email: newUser.email,
				password: hashedPassword,
				paciente: {
					create: {
						nome: newUser.nome,
						contacto: newUser.contacto,
						morada: newUser.morada,
					},
				},
			},
			include: {
				paciente: true,
			},
		});

		reply.status(201).send({ user });
	} catch (err) {
		console.error(err);
		reply.status(409).send({ err: 'O Email já existe, ou dados inválidos' });
	}
}
