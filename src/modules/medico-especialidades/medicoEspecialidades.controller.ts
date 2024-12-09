import { FastifyReply, FastifyRequest } from 'fastify';
import { createMedicoEspecialidadesSchema } from './medicoEspecialidades.schema';
import { prisma } from '../../lib/prisma';
import { verifyEspecialidadeIsAssociated } from '../../lib/verify-especialidade-is-associated';
import { verifyMedicoExists } from '../../lib/verify-medico-exists';
import { verifyEspecialidadeExists } from '../../lib/verify-especialidade-exists';

export async function createMedicoEspecialidade(request: FastifyRequest, reply: FastifyReply) {
	const { id_medico, id_especialidade } = createMedicoEspecialidadesSchema.parse(request.body);

	try {
		// Verifica se o médico existe
		if (!(await verifyMedicoExists(id_medico))) {
			return reply.status(404).send({ err: 'Médico nao encontrado' });
		}

		// Verifica se a especialidade existe
		if (!(await verifyEspecialidadeExists(id_especialidade))) {
			return reply.status(404).send({ err: 'Especialidade nao encontrada' });
		}

		// Verifica se a especialidade já foi associada ao médico
		if (await verifyEspecialidadeIsAssociated(id_medico, id_especialidade)) {
			return reply.status(400).send({ err: 'O médico já está associado a esta especialidade' });
		}

		const medicoEspecialidade = await prisma.medicoEspecialidades.create({
			data: {
				id_medico,
				id_especialidade,
			},
		});

		reply.status(201).send(medicoEspecialidade);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao criar associação' });
	}
}

export async function getEspecialidadesByMedico(request: FastifyRequest<{ Params: { id_medico: string } }>, reply: FastifyReply) {
	const { id_medico } = request.params;

	try {
		const medicoEspecialidades = await prisma.medicoEspecialidades.findMany({
			where: {
				id_medico: id_medico,
			},
			include: {
				especialidade: {
					select: {
						designacao: true,
					},
				},
			},
		});

		if (medicoEspecialidades.length === 0) {
			return reply.status(404).send({ error: 'Nenhuma especialidade encontrada para este médico' });
		}

		reply.status(200).send(medicoEspecialidades);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao buscar especialidades do médico' });
	}
}

export async function deleteMedicoEspecialidade(request: FastifyRequest<{ Params: { id_medico: string; id_especialidade: string } }>, reply: FastifyReply) {
	const { id_medico, id_especialidade } = request.params;

	try {
		await prisma.medicoEspecialidades.delete({
			where: {
				id_medico_id_especialidade: {
					id_medico,
					id_especialidade,
				},
			},
		});

		reply.status(204).send();
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao remover associação entre médico e especialidade' });
	}
}
