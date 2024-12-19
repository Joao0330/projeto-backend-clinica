import dayjs from 'dayjs';
import { z } from 'zod';

export const createConsultaSchema = z
	.object({
		id_medico: z.string().uuid(),
		id_paciente: z.string().uuid().optional(),
		id_especialidade: z.string().uuid(),
		data_inicio: z.string().refine(date => dayjs(date).isAfter(dayjs()), {
			message: 'A data de início deve ser no futuro.',
		}),
		data_fim: z.string(),
	})
	.superRefine((fields, ctx) => {
		const { data_inicio, data_fim } = fields;

		if (dayjs(data_fim).isBefore(dayjs(data_inicio))) {
			ctx.addIssue({
				path: ['data_fim'],
				code: 'invalid_date',
				message: 'A data de término deve ser maior que a data de início.',
			});
		}
	});

export const updateConsultaSchema = z
	.object({
		data_inicio: z
			.string()
			.optional()
			.refine(date => dayjs(date).isAfter(dayjs()), {
				message: 'A data de início deve ser no futuro.',
			}),
		data_fim: z.string().optional(),
	})
	.superRefine((fields, ctx) => {
		const { data_inicio, data_fim } = fields;

		if (data_inicio && data_fim && dayjs(data_fim).isBefore(dayjs(data_inicio))) {
			ctx.addIssue({
				path: ['data_fim'],
				code: 'invalid_date',
				message: 'A data de término deve ser maior que a data de início.',
			});
		}
	});
