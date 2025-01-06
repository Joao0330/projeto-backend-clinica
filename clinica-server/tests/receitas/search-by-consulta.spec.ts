import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { searchByConsulta } from '../../src/http/controllers/receitas/search-by-consulta';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		receita: {
			findMany: vi.fn(),
		},
	},
}));

describe('searchByConsulta', () => {
	const mockRequest = {
		params: {
			id_consulta_medico: '1',
			id_consulta: '1',
		},
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should return receitas by consulta', async () => {
		vi.mocked(prisma.receita.findMany).mockResolvedValue([
			{
				id_consulta_medico: '1',
				id_consulta: '1',
				farmaco: {
					id: '1',
					nome: 'Farmaco 1',
				},
			} as any,
		]);

		await searchByConsulta(mockRequest as any, mockReply as any);

		expect(mockReply.send).toHaveBeenCalledWith([
			{
				id_consulta_medico: '1',
				id_consulta: '1',
				farmaco: {
					id: '1',
					nome: 'Farmaco 1',
				},
			},
		]);
	});

	it('should return 404 error if no receita is found', async () => {
		vi.mocked(prisma.receita.findMany).mockResolvedValue([]);

		await searchByConsulta(mockRequest as any, mockReply as any);

		expect(mockReply.status).toHaveBeenCalledWith(404);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Nenhuma receita encontrada para esta consulta.' });
	});
});
