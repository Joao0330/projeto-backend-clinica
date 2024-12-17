import { prisma } from './prisma';

export async function verifyEspecialidadeMedico(id_medico: string, id_especialidade: string): Promise<boolean> {
	try {
		const medicoEspecialidades = await prisma.medicoEspecialidades.findMany({
			where: { id_medico },
			select: { id_especialidade: true },
		});

		const especialidadesPermitidas = medicoEspecialidades.map(e => e.id_especialidade);

		return especialidadesPermitidas.includes(id_especialidade);
	} catch (error) {
		console.error('Erro ao verificar especialidade do médico:', error);
		return false;
	}
}
