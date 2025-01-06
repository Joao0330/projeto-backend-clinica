import { FastifyReply, FastifyRequest } from "fastify";
import { createMedicoEspecialidadesSchema } from "../../../schemas/medicoEspecialidades.schema";
import { verifyMedicoExists } from "../../../lib/verify-medico-exists";
import { verifyEspecialidadeExists } from "../../../lib/verify-especialidade-exists";
import { verifyEspecialidadeIsAssociated } from "../../../lib/verify-especialidade-is-associated";
import { prisma } from "../../../lib/prisma";

export async function create(request: FastifyRequest, reply: FastifyReply) {
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
