import { FastifyReply, FastifyRequest } from 'fastify';
import { createFarmacoSchema } from '../../../schemas/farmacos.schema';
import { verifyFarmacoWithSameName } from '../../../lib/verify-farmaco-same-name';
import { prisma } from '../../../lib/prisma';

export async function create(request: FastifyRequest, reply: FastifyReply) {
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
