import { z } from 'zod';

export const createMedicoSchema = z.object({
	nome: z.string().min(1),
	contacto: z.string().min(9).optional(),
	morada: z.string().optional(),
	numero_ordem: z.string().min(1),
	email: z.string().email(),
	password: z.string().min(6),
});

export const updateMedicoSchema = z.object({
	nome: z.string().min(1).optional(),
	contacto: z.string().min(9).optional(),
	morada: z.string().optional(),
	numero_ordem: z.string().min(1).optional(),
});
