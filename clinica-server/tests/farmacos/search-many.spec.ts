import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { searchMany } from '../../src/http/controllers/farmacos/search-many';
import { randomUUID } from 'crypto';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		farmacos: {
			findMany: vi.fn(),
		},
	},
}));

describe('searchMany', () => {
	const mockRequest = {};

	const mockReply = {
		send: vi.fn(),
	};

	it('should search for all farmacos', async () => {
		vi.mocked(prisma.farmacos.findMany).mockResolvedValue([
			{ id: '1', nome: 'paracetamol' },
			{ id: '2', nome: 'ipubrufeno' },
		]);

		await searchMany(mockRequest as any, mockReply as any);

		expect(prisma.farmacos.findMany).toHaveBeenCalled();
		expect(mockReply.send).toHaveBeenCalledWith([
			{ id: '1', nome: 'paracetamol' },
			{ id: '2', nome: 'ipubrufeno' },
		]);
	});
});
