import { FastifyReply, FastifyRequest } from 'fastify';
import { createEspecialidadeSchema } from '../../../schemas/especialidades.schema';
import { verifySameEspecialidade } from '../../../lib/verify-same-especialidade';
import { prisma } from '../../../lib/prisma';

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const { designacao } = createEspecialidadeSchema.parse(request.body);

	try {
		if (await verifySameEspecialidade(designacao)) {
			return reply.status(409).send({ err: 'Especialidade ja cadastrada' });
		}

		const especialidade = await prisma.especialidades.create({
			data: { designacao },
		});

		reply.status(201).send(especialidade);
	} catch (err) {
		reply.status(422).send({ err: 'Erro ao criar especialidade' });
	}
}
