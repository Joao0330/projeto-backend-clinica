import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { deleteFarmaco } from '../../src/http/controllers/farmacos/delete';
import { randomUUID } from 'crypto';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		farmacos: {
			delete: vi.fn(),
		},
	},
}));

describe('deleteFarmaco', () => {
	const mockRequest = {
		params: { id: randomUUID() },
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should delete a farmaco', async () => {
		vi.mocked(prisma.farmacos.delete).mockResolvedValue({
			id: mockRequest.params.id,
			nome: null,
		});

		await deleteFarmaco(mockRequest as any, mockReply as any);

		expect(prisma.farmacos.delete).toHaveBeenCalledWith({
			where: { id: mockRequest.params.id },
		});
		expect(mockReply.status).toHaveBeenCalledWith(204);
		expect(mockReply.send).toHaveBeenCalled();
	});
});
