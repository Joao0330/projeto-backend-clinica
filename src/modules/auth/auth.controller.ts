import { FastifyReply, FastifyRequest } from 'fastify';
import { createLoginSchema, createRegisterSchema } from './auth.schema';
import { compare, hash } from 'bcrypt';
import { prisma } from '../../lib/prisma';
import { verifyUserExists } from '../../lib/verify-user-exists';
import { verifyContact } from '../../lib/verify-contact';

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
		reply.status(409).send({ err: 'O Email já existe, ou dados inválidos' });
	}
}

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
