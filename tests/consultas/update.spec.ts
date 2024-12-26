import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { update } from '../../src/http/controllers/consultas/update';
import { verifySchedule } from '../../src/lib/verify-schedule';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		user: {
			findUnique: vi.fn(),
		},
		consultas: {
			findUnique: vi.fn(),
			update: vi.fn(),
		},
	},
}));

vi.mock('../../src/lib/verify-schedule', () => ({
	verifySchedule: vi.fn(),
}));

describe('updateConsulta', () => {
	const mockRequest = {
		user: {
			role: 'UTENTE',
			id: randomUUID(),
		},
		params: {
			id_medico: randomUUID(),
			id_consulta: randomUUID(),
		},
		body: {
			data_inicio: '2024-12-28T14:00:00.000Z',
			data_fim: '2024-12-28T15:00:00.000Z',
		},
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should update a consulta', async () => {
		vi.mocked(prisma.consultas.findUnique).mockResolvedValue({
			id_medico: mockRequest.params.id_medico,
		} as any);
		vi.mocked(prisma.user.findUnique).mockResolvedValue({
			medicoId: mockRequest.params.id_medico,
		} as any);
		vi.mocked(verifySchedule).mockResolvedValue({ conflito: false });
		vi.mocked(prisma.consultas.update).mockResolvedValue({
			id_medico: mockRequest.params.id_medico,
			id_consulta: mockRequest.params.id_consulta,
			data_inicio: mockRequest.body.data_inicio,
			data_fim: mockRequest.body.data_fim,
		} as any);

		await update(mockRequest as any, mockReply as any);

		expect(prisma.consultas.update).toHaveBeenCalledWith({
			where: {
				id_medico_id_consulta: {
					id_medico: mockRequest.params.id_medico,
					id_consulta: mockRequest.params.id_consulta,
				},
			},
			data: {
				data_inicio: dayjs(mockRequest.body.data_inicio).toDate(),
				data_fim: dayjs(mockRequest.body.data_fim).toDate(),
			},
		});
	});

	it('should return 400 if schedule conflicts', async () => {
		vi.mocked(prisma.consultas.findUnique).mockResolvedValue({
			id_medico: mockRequest.params.id_medico,
		} as any);
		vi.mocked(prisma.user.findUnique).mockResolvedValue({
			medicoId: mockRequest.params.id_medico,
		} as any);
		vi.mocked(verifySchedule).mockResolvedValue({ conflito: true });

		await update(mockRequest as any, mockReply as any);

		expect(verifySchedule).toHaveBeenCalledWith(mockRequest.body.data_inicio, mockRequest.body.data_fim, mockRequest.params.id_medico);
		expect(mockReply.status).toHaveBeenCalledWith(400);
		expect(mockReply.send).toHaveBeenCalledWith({
			err: 'Horário indisponível para o médico.',
		});
	});

	it('should return 404 if consulta does not exist', async () => {
		vi.mocked(prisma.consultas.findUnique).mockResolvedValue(null);

		await update(mockRequest as any, mockReply as any);

		expect(prisma.consultas.findUnique).toHaveBeenCalledWith({
			where: {
				id_medico_id_consulta: {
					id_medico: mockRequest.params.id_medico,
					id_consulta: mockRequest.params.id_consulta,
				},
			},
		});
		expect(mockReply.status).toHaveBeenCalledWith(404);
		expect(mockReply.send).toHaveBeenCalledWith({ error: 'Consulta não encontrada.' });
	});
});
