import { z } from 'zod';

export const createMedicoEspecialidadesSchema = z.object({
	id_medico: z.string().uuid(),
	id_especialidade: z.string().uuid(),
});
