import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { searchOne } from '../../src/http/controllers/farmacos/search-one';
import { randomUUID } from 'crypto';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		farmacos: {
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

	it('should return farmaco data', async () => {
		vi.mocked(prisma.farmacos.findUnique).mockResolvedValue({
			id: mockRequest.params.id,
			nome: 'paracetamol',
		});

		await searchOne(mockRequest as any, mockReply as any);

		expect(mockReply.send).toHaveBeenCalledWith({
			id: mockRequest.params.id,
			nome: 'paracetamol',
		});
	});

	it('should return 404 if farmaco not found', async () => {
        vi.mocked(prisma.farmacos.findUnique).mockResolvedValue(null);
        
		await searchOne(mockRequest as any, mockReply as any);
        
		expect(mockReply.status).toHaveBeenCalledWith(404);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Fármaco nao encontrado' });
	});
});
