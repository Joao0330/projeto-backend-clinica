import { prisma } from './prisma';

export async function createNumeroConsulta(id_medico: string): Promise<any> {
	const existingNumeroConsulta = await prisma.consultas.findFirst({
		where: { id_medico },
		orderBy: { numero_consulta: 'desc' },
	});

	return existingNumeroConsulta ? existingNumeroConsulta.numero_consulta + 1 : 1;
}
