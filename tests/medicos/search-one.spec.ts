import { describe, expect, it, vi } from 'vitest';
import { searchOne } from '../../src/http/controllers/medicos/search-one';
import { prisma } from '../../src/lib/prisma';
import { randomUUID } from 'crypto';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		medicos: {
			findUnique: vi.fn(),
		},
	},
}));

describe('searchOne', () => {
	const mockRequest = {
		params: { id: randomUUID() },
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should return medico data', async () => {
		vi.mocked(prisma.medicos.findUnique).mockResolvedValue({
			id: mockRequest.params.id,
			nome: 'Medico 1',
		} as any);

		await searchOne(mockRequest as any, mockReply as any);

		expect(mockReply.send).toHaveBeenCalledWith({
			id: mockRequest.params.id,
			nome: 'Medico 1',
        });
	});

	it('should return 404 error if medico not found', async () => {
		vi.mocked(prisma.medicos.findUnique).mockResolvedValue(null);

		await searchOne(mockRequest as any, mockReply as any);

		expect(mockReply.status).toHaveBeenCalledWith(404);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Medico nao encontrado' });
	});
});
