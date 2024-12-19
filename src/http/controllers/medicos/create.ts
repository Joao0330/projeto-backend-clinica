import { FastifyReply, FastifyRequest } from 'fastify';
import { medicoParams } from './medicos.types';
import { createMedicoSchema } from '../../../schemas/medicos.schema';
import { verifyContact } from '../../../lib/verify-contact';
import { verifyUserExists } from '../../../lib/verify-user-exists';
import { createNumeroEmpregado } from '../../../lib/create-numero-empregado';
import { hash } from 'bcrypt';
import { prisma } from '../../../lib/prisma';

export async function create(request: FastifyRequest<{ Params: medicoParams }>, reply: FastifyReply) {
	const { id } = request.params;
	const medicoData = createMedicoSchema.parse(request.body);

	try {
		if (medicoData.contacto !== undefined && (await verifyContact(medicoData.contacto, 'medicos'))) {
			return reply.status(409).send({ err: 'Contacto ja cadastrado' });
		}
		if (await verifyUserExists(medicoData.email)) {
			return reply.status(409).send({ error: 'E-mail já cadastrado' });
		}

		const numeroEmpregado = await createNumeroEmpregado(id);

		const hashedPassword = await hash(medicoData.password, 6);

		const medico = await prisma.medicos.create({
			data: {
				nome: medicoData.nome,
				contacto: medicoData.contacto,
				morada: medicoData.morada,
				numero_empregado: numeroEmpregado,
				User: {
					create: {
						nome: medicoData.nome,
						contacto: medicoData.contacto,
						morada: medicoData.morada,
						email: medicoData.email,
						password: hashedPassword,
						role: 'MEDICO',
					},
				},
			},
			include: {
				User: true,
			},
		});

		reply.status(201).send(medico);
	} catch (err) {
		reply.status(422).send({ err: 'Erro ao criar médico' });
	}
}
