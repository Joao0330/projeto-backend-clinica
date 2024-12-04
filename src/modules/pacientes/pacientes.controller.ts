import { FastifyReply, FastifyRequest } from 'fastify';
import { createPacienteSchema, updatePacienteSchema } from './pacientes.schema';
import { prisma } from '../../lib/prisma';

export async function getAllPacientes(request: FastifyRequest, reply: FastifyReply) {
	try {
		const pacientes = await prisma.pacientes.findMany();
		reply.send(pacientes);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao listar pacientes' });
	}
}

export async function getPacienteById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	const { id } = request.params;

	try {
		const paciente = await prisma.pacientes.findUnique({
			where: {
				id,
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

export async function createPaciente(request: FastifyRequest, reply: FastifyReply) {
	const pacienteData = createPacienteSchema.parse(request.body);

	try {
		const paciente = await prisma.pacientes.create({
			data: pacienteData,
		});

		reply.status(201).send(paciente);
	} catch (err) {
		reply.status(422).send({ err: 'Erro ao criar paciente' });
	}
}

export async function updatePaciente(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	const { id } = request.params;
	const updatedPaciente = updatePacienteSchema.parse(request.body);

	try {
		const paciente = await prisma.pacientes.update({
			where: { id },
			data: updatedPaciente,
		});

		reply.send(paciente);
	} catch (err) {
		reply.status(422).send({ err: 'Erro ao atualizar paciente' });
	}
}

export async function deletePaciente(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
	const { id } = request.params;

    try {
        await prisma.pacientes.delete({
            where: {id}
        });

        reply.status(204).send();
    } catch (err) {
        reply.status(500).send({ err: 'Erro ao apagar paciente' });
    }
}
