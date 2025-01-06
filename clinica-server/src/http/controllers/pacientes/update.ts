import { FastifyReply, FastifyRequest } from 'fastify';
import { pacientesParams } from './pacientes.types';
import { updatePacienteSchema } from '../../../schemas/pacientes.schema';
import { verifyContact } from '../../../lib/verify-contact';
import { prisma } from '../../../lib/prisma';

export async function update(request: FastifyRequest<{ Params: pacientesParams }>, reply: FastifyReply) {
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
