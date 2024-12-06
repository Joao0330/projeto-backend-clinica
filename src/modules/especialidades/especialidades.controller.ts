import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { createEspecialidadeSchema, updateEspecialidadeSchema } from './especialidades.schema';
import { verifySameEspecialidade } from '../../lib/verify-same-especialidade';

export async function getAllEspecialidades(request: FastifyRequest, reply: FastifyReply) {
	try {
		const especialidades = await prisma.especialidades.findMany();
		reply.send(especialidades);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao listar especialidades' });
	}
}

export async function getEspecialidade(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	const { id } = request.params;

	try {
		const especialidade = await prisma.especialidades.findUnique({
			where: {
				id,
			},
		});

		if (!especialidade) {
			return reply.status(404).send({ err: 'Especialidade não encontrada' });
		}

		reply.send(especialidade);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao buscar especialidade' });
	}
}

export async function createEspecialidade(request: FastifyRequest, reply: FastifyReply) {
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

export async function updateEspecialidade(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
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

export async function deleteEspecialidade(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	const { id } = request.params;

	try {
		await prisma.especialidades.delete({
			where: { id },
		});

		reply.status(204).send();
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao apagar especialidade' });
	}
}
