import { prisma } from './prisma';

export async function verifyEspecialidadeExists(id_especialidade: string): Promise<boolean> {
	const especialidade = await prisma.especialidades.findUnique({
		where: {
			id: id_especialidade,
		},
	});

	return especialidade !== null;
}
