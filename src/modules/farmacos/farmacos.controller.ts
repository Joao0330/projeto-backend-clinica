import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { createFarmacoSchema, updateFarmacoSchema } from './farmacos.schema';
import { verifyFarmacoWithSameName } from '../../lib/verify-farmaco-same-name';

export async function getAllFarmacos(request: FastifyRequest, reply: FastifyReply) {
	try {
		const farmacos = await prisma.farmacos.findMany();
		reply.send(farmacos);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao listar farmacos' });
	}
}

export async function getFarmaco(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	const { id } = request.params;

	try {
		const farmaco = await prisma.farmacos.findUnique({
			where: {
				id,
			},
		});

		if (!farmaco) {
			return reply.status(404).send({ err: 'Fármaco nao encontrado' });
		}

		reply.send(farmaco);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao buscar fármaco' });
	}
}

export async function createFarmaco(request: FastifyRequest, reply: FastifyReply) {
	const { nome } = createFarmacoSchema.parse(request.body);

	try {
		if (await verifyFarmacoWithSameName(nome)) {
			return reply.status(409).send({ err: 'Fármaco com este nome já existe!' });
		}

		const farmaco = await prisma.farmacos.create({
			data: { nome },
		});

		reply.status(201).send(farmaco);
	} catch (err) {
		reply.status(422).send({ err: 'Erro ao criar fármaco' });
	}
}

export async function updateFarmaco(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	const { id } = request.params;
	const updatedFarmaco = updateFarmacoSchema.parse(request.body);

	try {
		const farmaco = await prisma.farmacos.update({
			where: { id },
			data: updatedFarmaco,
		});

		reply.send(farmaco);
	} catch (err) {
		reply.status(422).send({ err: 'Erro ao atualizar fármaco' });
	}
}

export async function deleteFarmaco(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	const { id } = request.params;

	try {
		await prisma.farmacos.delete({
			where: { id },
		});

		reply.status(204).send();
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao apagar fármaco' });
	}
}
