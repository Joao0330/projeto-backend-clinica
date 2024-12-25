import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { deleteReceita } from '../../src/http/controllers/receitas/delete';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		receita: {
			delete: vi.fn(),
		},
	},
}));

describe('deleteReceita', () => {
	const mockRequest = {
		params: {
			id_consulta_medico: '1',
			id_consulta: '1',
			id_farmaco: '1',
		},
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should delete a receita', async () => {
		vi.mocked(prisma.receita.delete).mockResolvedValue({
			id_consulta_medico: mockRequest.params.id_consulta_medico,
			id_consulta: mockRequest.params.id_consulta,
			id_farmaco: mockRequest.params.id_farmaco,
			data_receita: new Date(),
		});

		await deleteReceita(mockRequest as any, mockReply as any);

		expect(prisma.receita.delete).toHaveBeenCalledWith({
			where: {
				id_consulta_medico_id_consulta_id_farmaco: {
					id_consulta_medico: '1',
					id_consulta: '1',
					id_farmaco: '1',
				},
			},
		});
		expect(mockReply.status).toHaveBeenCalledWith(204);
		expect(mockReply.send).toHaveBeenCalled();
	});
});
