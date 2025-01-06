import { FastifyReply, FastifyRequest } from "fastify";
import { pacientesParams } from "./pacientes.types";
import { prisma } from "../../../lib/prisma";

export async function searchOne(request: FastifyRequest<{ Params: pacientesParams }>, reply: FastifyReply) {
	const { id: idPaciente } = request.params;
	const { id: idMedico } = request.user;

	try {
		const medico = await prisma.user.findUnique({
			where: { id: idMedico },
			select: {
				medicoId: true,
			},
		});

		// Verifica se existe uma relação entre o paciente e o médico logado
		const consulta = await prisma.consultas.findFirst({
			where: {
				id_paciente: idPaciente,
				id_medico: medico?.medicoId ?? undefined,
			},
		});

		if (!consulta) {
			return reply.status(403).send({ err: 'Você não tem consulta marcada com este paciente.' });
		}

		const paciente = await prisma.pacientes.findUnique({
			where: {
				id: idPaciente,
			},
			include: {
				consultas: {
					include: {
						especialidade: true,
						medico: {
							select: {
								nome: true,
							},
						},
					},
					orderBy: {
						data_inicio: 'desc',
					},
				},
			},
		});

		if (!paciente) {
			return reply.status(404).send({ err: 'Paciente nao encontrado' });
		}

		reply.send(paciente);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao buscar paciente' });
	}
}
