import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { deleteConsulta } from '../../src/http/controllers/consultas/delete';
import { randomUUID } from 'crypto';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		consultas: {
			delete: vi.fn(),
		},
	},
}));

describe('deleteConsulta', () => {
	const mockRequest = {
		params: {
			id_medico: randomUUID(),
			id_consulta: randomUUID(),
		},
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should delete a consulta', async () => {
		vi.mocked(prisma.consultas.delete).mockResolvedValue({
			id_medico: mockRequest.params.id_medico,
			id_consulta: mockRequest.params.id_consulta,
		} as any);

		await deleteConsulta(mockRequest as any, mockReply as any);

		expect(prisma.consultas.delete).toHaveBeenCalledWith({
			where: {
				id_medico_id_consulta: {
					id_medico: mockRequest.params.id_medico,
					id_consulta: mockRequest.params.id_consulta,
				},
			},
		});
		expect(mockReply.status).toHaveBeenCalledWith(204);
		expect(mockReply.send).toHaveBeenCalled();
	});
});
