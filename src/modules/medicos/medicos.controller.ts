import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { createMedicoSchema, updateMedicoSchema } from './medicos.schema';

export async function getAllMedicos(request: FastifyRequest, reply: FastifyReply) {
	try {
		const medicos = await prisma.medicos.findMany();
		reply.send(medicos);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao listar medicos' });
	}
}

export async function getMedicoById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
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

export async function createMedico(request: FastifyRequest, reply: FastifyReply) {
	const medicoData = createMedicoSchema.parse(request.body);

	try {
		const medico = await prisma.medicos.create({
			data: medicoData,
		});

		reply.status(201).send(medico);
	} catch (err) {
		reply.status(422).send({ err: 'Erro ao criar médico' });
	}
}

export async function updateMedico(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	const { id } = request.params;
	const updatedMedico = updateMedicoSchema.parse(request.body);

	try {
		const medico = await prisma.medicos.update({
			where: { id },
			data: updatedMedico,
		});

		reply.send(medico);
	} catch (err) {
		reply.status(422).send({ err: 'Médico não encontrado' });
	}
}

export async function deleteMedico(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
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
