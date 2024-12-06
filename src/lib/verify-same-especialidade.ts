import { prisma } from './prisma';

export async function verifySameEspecialidade(especialidade: string): Promise<boolean> {
	const existingEspecialidade = await prisma.especialidades.findFirst({
		where: {
			designacao: especialidade,
		},
	});

	return existingEspecialidade !== null;
}
