import { z } from "zod";

export const createRegisterSchema = z.object({
	nome: z.string().min(1),
	contacto: z.string().min(9).optional(),
	morada: z.string().optional(),
	email: z.string().email(),
	password: z.string().min(6),
});

export const createLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})