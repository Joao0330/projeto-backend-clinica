import { describe, expect, it, vi } from 'vitest';
import { searchByMedico } from '../../src/http/controllers/medico-especialidades/search-by-medico';
import { prisma } from '../../src/lib/prisma';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		medicoEspecialidades: {
			findMany: vi.fn(),
		},
	},
}));

describe('searchByMedico', () => {
	const mockRequest = {
		params: { id_medico: '1' },
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should return the especialidade by medico', async () => {
		vi.mocked(prisma.medicoEspecialidades.findMany).mockResolvedValue([
			{
				id_medico: '1',
				id_especialidade: '1',
				especialidade: {
					designacao: 'Especialidade 1',
				},
			} as any,
		]);

		await searchByMedico(mockRequest as any, mockReply as any);

		expect(mockReply.status).toHaveBeenCalledWith(200);
		expect(mockReply.send).toHaveBeenCalledWith([
			{
				id_medico: '1',
				id_especialidade: '1',
				especialidade: {
					designacao: 'Especialidade 1',
				},
			},
		]);
	});

	it('should return 404 error if no especialidade is found', async () => {
		vi.mocked(prisma.medicoEspecialidades.findMany).mockResolvedValue([]);

		await searchByMedico(mockRequest as any, mockReply as any);

		expect(mockReply.status).toHaveBeenCalledWith(404);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Nenhuma especialidade encontrada para este médico' });
	});
});
