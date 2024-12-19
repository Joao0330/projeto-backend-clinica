import { FastifyReply, FastifyRequest } from 'fastify';
import { farmacosParams } from './farmacos.types';
import { updateFarmacoSchema } from '../../../schemas/farmacos.schema';
import { verifyFarmacoWithSameName } from '../../../lib/verify-farmaco-same-name';
import { prisma } from '../../../lib/prisma';

export async function update(request: FastifyRequest<{ Params: farmacosParams }>, reply: FastifyReply) {
	const { id } = request.params;
	const { nome } = updateFarmacoSchema.parse(request.body);

	try {
		if (await verifyFarmacoWithSameName(nome)) {
			return reply.status(409).send({ err: 'Fármaco com este nome já existe!' });
		}

		const farmaco = await prisma.farmacos.update({
			where: { id },
			data: { nome },
		});

		reply.send(farmaco);
	} catch (err) {
		reply.status(422).send({ err: 'Erro ao atualizar fármaco' });
	}
}
