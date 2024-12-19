import { FastifyReply, FastifyRequest } from 'fastify';
import { medicoParams } from './medicos.types';
import { updateMedicoSchema } from '../../../schemas/medicos.schema';
import { verifyContact } from '../../../lib/verify-contact';
import { prisma } from '../../../lib/prisma';

export async function update(request: FastifyRequest<{ Params: medicoParams }>, reply: FastifyReply) {
	const { id } = request.params;
	const updatedMedico = updateMedicoSchema.parse(request.body);

	try {
		if (updatedMedico.contacto !== undefined && (await verifyContact(updatedMedico.contacto, 'medicos'))) {
			return reply.status(409).send({ err: 'Contacto ja cadastrado' });
		}

		const medico = await prisma.medicos.update({
			where: { id },
			data: {
				...updatedMedico,
				User: {
					updateMany: {
						where: { medicoId: id },
						data: {
							nome: updatedMedico.nome,
							contacto: updatedMedico.contacto,
							morada: updatedMedico.morada,
						},
					},
				},
			},
			include: {
				User: true,
			},
		});

		reply.send(medico);
	} catch (err) {
		reply.status(422).send({ err: 'Médico não encontrado' });
	}
}
