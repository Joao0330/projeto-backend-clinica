import { FastifyReply, FastifyRequest } from 'fastify';
import { createPacienteSchema } from '../../../schemas/pacientes.schema';
import { verifyUserExists } from '../../../lib/verify-user-exists';
import { verifyContact } from '../../../lib/verify-contact';
import { hash } from 'bcrypt';
import { prisma } from '../../../lib/prisma';

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const pacienteData = createPacienteSchema.parse(request.body);

	try {
		if (await verifyUserExists(pacienteData.email)) {
			return reply.status(409).send({ error: 'E-mail já cadastrado' });
		}

		if (pacienteData.contacto !== undefined && (await verifyContact(pacienteData.contacto, 'pacientes'))) {
			return reply.status(409).send({ err: 'Contacto ja cadastrado' });
		}

		const hashedPassword = await hash(pacienteData.password, 6);

		const paciente = await prisma.pacientes.create({
			data: {
				nome: pacienteData.nome,
				contacto: pacienteData.contacto,
				morada: pacienteData.morada,
				User: {
					create: {
						nome: pacienteData.nome,
						contacto: pacienteData.contacto,
						morada: pacienteData.morada,
						email: pacienteData.email,
						password: hashedPassword,
						role: 'UTENTE',
					},
				},
			},
			include: {
				User: true,
			},
		});

		reply.status(201).send(paciente);
	} catch (err) {
		reply.status(422).send({ err: 'Erro ao criar paciente' });
	}
}
