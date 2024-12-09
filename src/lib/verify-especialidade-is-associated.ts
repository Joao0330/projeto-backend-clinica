import { prisma } from "./prisma";

export async function verifyEspecialidadeIsAssociated(id_medico: string, id_especialidade: string): Promise<boolean> {
	const especialidadeAssociada = await prisma.medicoEspecialidades.findUnique({
		where: {
			id_medico_id_especialidade: { id_medico, id_especialidade },
		},
	});

    return especialidadeAssociada !== null; 
}
