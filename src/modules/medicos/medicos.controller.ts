import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { createMedicoSchema, updateMedicoSchema } from './medicos.schema';
import { verifyContact } from '../../lib/verify-contact';
import { verifyUserExists } from '../../lib/verify-user-exists';
import { hash } from 'bcrypt';
import { createNumeroEmpregado } from '../../lib/create-numero-empregado';

export interface medicoParams {
	id: string;
}

export async function getAllMedicos(request: FastifyRequest, reply: FastifyReply) {
	try {
		const medicos = await prisma.medicos.findMany();
		reply.send(medicos);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao listar medicos' });
	}
}

export async function getMedicoById(request: FastifyRequest<{ Params: medicoParams }>, reply: FastifyReply) {
	const { id } = request.params;

	try {
		const medico = await prisma.medicos.findUnique({
			where: {
				id,
			},
		});

		if (!medico) {
			reply.status(404).send({ err: 'Medico nao encontrado' });
		}

		reply.send(medico);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao buscar medico' });
	}
}

export async function createMedico(request: FastifyRequest<{ Params: medicoParams }>, reply: FastifyReply) {
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

export async function updateMedico(request: FastifyRequest<{ Params: medicoParams }>, reply: FastifyReply) {
	const { id } = request.params;
	const updatedMedico = updateMedicoSchema.parse(request.body);

	try {
		if (updatedMedico.contacto !== undefined && (await verifyContact(updatedMedico.contacto, 'medicos'))) {
			return reply.status(409).send({ err: 'Contacto ja cadastrado' });
		}

		const medico = await prisma.medicos.update({
			where: { id },
			data: {
				...updatedMedico,
				User: {
					updateMany: {
						where: { medicoId: id },
						data: {
							nome: updatedMedico.nome,
							contacto: updatedMedico.contacto,
							morada: updatedMedico.morada,
						},
					},
				},
			},
			include: {
				User: true,
			},
		});

		reply.send(medico);
	} catch (err) {
		reply.status(422).send({ err: 'Médico não encontrado' });
	}
}

export async function deleteMedico(request: FastifyRequest<{ Params: medicoParams }>, reply: FastifyReply) {
	const { id } = request.params;

	try {
		await prisma.medicos.delete({
			where: { id },
		});

		reply.status(204).send();
	} catch (err) {
		reply.status(500).send({ err: 'Médico não encontrado' });
	}
}
