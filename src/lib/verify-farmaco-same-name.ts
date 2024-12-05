import { prisma } from './prisma';

export async function verifyFarmacoWithSameName(nome: string): Promise<boolean> {
	const existingFarmaco = await prisma.farmacos.findFirst({
		where: {
			nome: nome,
		},
	});

	return existingFarmaco !== null;
}
