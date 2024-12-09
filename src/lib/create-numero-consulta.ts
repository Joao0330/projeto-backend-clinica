import { prisma } from './prisma';

export async function createNumeroConsulta(): Promise<any> {
	const existingNumeroConsulta = await prisma.consultas.findFirst({
		orderBy: {
			numero_consulta: 'desc',
		},
		take: 1,
	});

	let numeroConsulta;

	if (existingNumeroConsulta) {
		return (numeroConsulta = existingNumeroConsulta.numero_consulta + 1);
	} else {
		return (numeroConsulta = 1);
	}
}
