import { prisma } from "./prisma";

export async function verifyConsultaExists(id_consulta: string, id_consulta_medico: string): Promise<boolean> {
	const consulta = await prisma.consultas.findUnique({
		where: {
			id_medico_id_consulta: {
				id_medico: id_consulta_medico,
				id_consulta,
			},
		},
	});

	return consulta !== null;
}
