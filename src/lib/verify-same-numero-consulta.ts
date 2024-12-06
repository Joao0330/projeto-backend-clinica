import { prisma } from './prisma';

export async function verifySameNumeroConsulta(numero_consulta: number): Promise<boolean> {
	const existingConsulta = await prisma.consultas.findFirst({
		where: {
			numero_consulta: numero_consulta,
		},
	});

	return existingConsulta !== null;
}
