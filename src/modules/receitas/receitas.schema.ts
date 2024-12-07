import { z } from "zod";

export const createReceitaSchema = z.object({
	id_consulta_medico: z.string().uuid(),
	id_consulta: z.string().uuid(),
	id_farmaco: z.string().uuid(),
});

export const getReceitaSchema = z.object({
	id_consulta_medico: z.string().uuid(),
	id_consulta: z.string().uuid(),
});

export const deleteReceitaSchema = z.object({
	id_consulta_medico: z.string().uuid(),
	id_consulta: z.string().uuid(),
	id_farmaco: z.string().uuid(),
});
