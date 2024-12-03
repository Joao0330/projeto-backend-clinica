import { z } from 'zod';

export const createPacienteSchema = z.object({
	nome: z.string().min(1),
	contacto: z.string().min(9).optional(),
	morada: z.string().optional(),
});

export const updatePacienteSchema = z.object({
	nome: z.string().min(1).optional(),
	contacto: z.string().min(9).optional(),
	morada: z.string().optional(),
});