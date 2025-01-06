import { z } from 'zod';

export const createEspecialidadeSchema = z.object({
	designacao: z.string().min(1),
});

export const updateEspecialidadeSchema = z.object({
	designacao: z.string().min(1).optional(),
});
