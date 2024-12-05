import { z } from 'zod';

export const createFarmacoSchema = z.object({
	nome: z.string().min(1),
});

export const updateFarmacoSchema = z.object({
	nome: z.string().min(1),
});
