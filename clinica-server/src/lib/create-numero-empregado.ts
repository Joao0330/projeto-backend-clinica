import { prisma } from './prisma';

export async function createNumeroEmpregado(id: string): Promise<any> {
	const existingNumeroEmpregado = await prisma.medicos.findFirst({
		where: { id },
		orderBy: { numero_empregado: 'desc' },
	});

	return existingNumeroEmpregado ? existingNumeroEmpregado.numero_empregado + 1 : 1;
}
