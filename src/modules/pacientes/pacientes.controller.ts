import { FastifyReply, FastifyRequest } from 'fastify';
import { createPacienteSchema, updatePacienteSchema } from './pacientes.schema';
import { prisma } from '../../lib/prisma';
import { verifyContact } from '../../lib/verify-contact';
import { verifyUserExists } from '../../lib/verify-user-exists';
import { hash } from 'bcrypt';

export interface pacientesParams {
	id: string;
}

export async function getAllPacientes(request: FastifyRequest, reply: FastifyReply) {
	try {
		const pacientes = await prisma.pacientes.findMany();
		reply.send(pacientes);
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao listar pacientes' });
	}
}

export async function getPacienteInfo(request: FastifyRequest<{ Params: pacientesParams }>, reply: FastifyReply) {
	const { id: idPaciente } = request.params;
	const { id: idMedico } = request.user;

	try {
		const medico = await prisma.user.findUnique({
			where: { id: idMedico },
			select: {
				medicoId: true,
			},
		});

		// Verificar se existe uma consulta entre o médico e o paciente
		const consulta = await prisma.consultas.findFirst({
			where: {
				id_paciente: idPaciente,
				id_medico: medico?.medicoId ?? undefined,
			},
		});

		console.log(idPaciente);
		console.log(idMedico);

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

export async function createPaciente(request: FastifyRequest, reply: FastifyReply) {
	const pacienteData = createPacienteSchema.parse(request.body);

	try {
		if (await verifyUserExists(pacienteData.email)) {
			return reply.status(409).send({ error: 'E-mail já cadastrado' });
		}

		if (pacienteData.contacto !== undefined && (await verifyContact(pacienteData.contacto, 'pacientes'))) {
			return reply.status(409).send({ err: 'Contacto ja cadastrado' });
		}

		const hashedPassword = await hash(pacienteData.password, 6);

		const paciente = await prisma.pacientes.create({
			data: {
				nome: pacienteData.nome,
				contacto: pacienteData.contacto,
				morada: pacienteData.morada,
				User: {
					create: {
						nome: pacienteData.nome,
						contacto: pacienteData.contacto,
						morada: pacienteData.morada,
						email: pacienteData.email,
						password: hashedPassword,
						role: 'UTENTE',
					},
				},
			},
			include: {
				User: true,
			},
		});

		reply.status(201).send(paciente);
	} catch (err) {
		reply.status(422).send({ err: 'Erro ao criar paciente' });
	}
}

export async function updatePaciente(request: FastifyRequest<{ Params: pacientesParams }>, reply: FastifyReply) {
	const { id } = request.params;
	const updatedPaciente = updatePacienteSchema.parse(request.body);

	try {
		if (updatedPaciente.contacto !== undefined && (await verifyContact(updatedPaciente.contacto, 'pacientes'))) {
			return reply.status(409).send({ err: 'Contacto ja cadastrado' });
		}

		const paciente = await prisma.pacientes.update({
			where: { id },
			data: {
				...updatedPaciente,
				User: {
					updateMany: {
						where: { pacienteId: id },
						data: {
							nome: updatedPaciente.nome,
							contacto: updatedPaciente.contacto,
							morada: updatedPaciente.morada,
						},
					},
				},
			},
		});

		reply.send(paciente);
	} catch (err) {
		reply.status(422).send({ err: 'Erro ao atualizar paciente' });
	}
}

export async function deletePaciente(request: FastifyRequest<{ Params: pacientesParams }>, reply: FastifyReply) {
	const { id } = request.params;

	try {
		await prisma.pacientes.delete({
			where: { id },
		});

		reply.status(204).send();
	} catch (err) {
		reply.status(500).send({ err: 'Erro ao apagar paciente' });
	}
}
