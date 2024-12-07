import { prisma } from './prisma';

export async function verifyFarmacoIsPrescripted(id_consulta_medico: string, id_consulta: string, id_farmaco: string): Promise<boolean> {
	const receitaExistente = await prisma.receita.findFirst({
		where: {
			id_consulta_medico,
			id_consulta,
			id_farmaco,
		},
    });
    
	return receitaExistente !== null;
}
