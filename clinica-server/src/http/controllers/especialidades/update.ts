import { FastifyReply, FastifyRequest } from 'fastify';
import { especialidadesParams } from './especialidades.types';
import { updateEspecialidadeSchema } from '../../../schemas/especialidades.schema';
import { verifySameEspecialidade } from '../../../lib/verify-same-especialidade';
import { prisma } from '../../../lib/prisma';

export async function update(request: FastifyRequest<{ Params: especialidadesParams }>, reply: FastifyReply) {
	const { id } = request.params;
	const { designacao } = updateEspecialidadeSchema.parse(request.body);

	try {
		if (designacao !== undefined && (await verifySameEspecialidade(designacao))) {
			return reply.status(409).send({ err: 'Especialidade ja cadastrada' });
		}

		const especialidade = await prisma.especialidades.update({
			where: { id },
			data: { designacao },
		});

		reply.send(especialidade);
	} catch (err) {
		reply.status(422).send({ err: 'Erro ao atualizar especialidade' });
	}
}
