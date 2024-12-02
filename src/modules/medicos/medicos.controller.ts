import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { createMedicoSchema, updateMedicoSchema } from './medicos.schema';

export async function getAllMedicos(request: FastifyRequest, reply: FastifyReply) {
	const medicos = await prisma.medicos.findMany();

	return reply.send(medicos);
}

export async function getMedicoById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	const { id } = request.params;

	const medico = await prisma.medicos.findUnique({
		where: {
			id,
		},
	});

	if (!medico) {
		return reply.status(404).send({ message: 'Medico nao encontrado' });
	}

	return reply.send(medico);
}

export async function createMedico(request: FastifyRequest, reply: FastifyReply) {
	try {
		const medicoData = createMedicoSchema.parse(request.body);
		const medico = await prisma.medicos.create({
			data: medicoData,
		});

		return reply.status(201).send(medico);
	} catch (err) {
		return reply.status(500).send({ err: 'Internal server error' });
	}
}

export async function updateMedico(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	const { id } = request.params;
	const medicoData = updateMedicoSchema.parse(request.body);

	try {
		const medico = await prisma.medicos.update({
			where: { id },
			data: medicoData,
		});

		return reply.send(medico);
	} catch (err) {
		return reply.status(404).send({ err: 'Médico não encontrado' });
	}
}

export async function deleteMedico(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	const { id } = request.params;

	try {
		await prisma.medicos.delete({
			where: { id },
		});

		return reply.status(204).send();
	} catch (err) {
		return reply.status(404).send({ err: 'Médico não encontrado' });
	}
}
