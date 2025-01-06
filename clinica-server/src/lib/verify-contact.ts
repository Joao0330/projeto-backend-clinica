import { prisma } from './prisma';

export async function verifyContact(contacto: string, table: 'pacientes' | 'medicos'): Promise<boolean> {
	if (table === 'pacientes') {
		const existingPaciente = await prisma.pacientes.findFirst({
			where: {
				contacto: contacto,
			},
		});
		return existingPaciente !== null;
	}

	if (table === "medicos") {
		const existingMedico = await prisma.medicos.findFirst({
			where: {
				contacto: contacto,
			},
		});
		return existingMedico !== null;
	} else {
		return false;
	}
}
