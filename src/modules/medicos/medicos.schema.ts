import { z } from 'zod';

export const createMedicoSchema = z.object({
	nome: z.string(),
	contacto: z.string().min(9),
	morada: z.string(),
	numero_ordem: z.string(),
});

export const updateMedicoSchema = z.object({
	nome: z.string().optional(),
	contacto: z.string().min(9).optional(),
	morada: z.string().optional(),
	numero_ordem: z.string().optional(),
});
