import { prisma } from './prisma';

export async function verifySameNumeroOrdem(numero_ordem: string): Promise<boolean> {
	const existingMedico = await prisma.medicos.findFirst({
		where: {
			numero_ordem: numero_ordem,
		},
	});

	return existingMedico !== null;
}
