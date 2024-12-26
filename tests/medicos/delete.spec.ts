import { describe, expect, it, vi } from 'vitest';
import { deleteMedico } from '../../src/http/controllers/medicos/delete';
import { prisma } from '../../src/lib/prisma';
import { randomUUID } from 'crypto';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		medicos: {
			delete: vi.fn(),
		},
	},
}));

describe('deleteMedico', () => {
	const mockRequest = {
		params: { id: randomUUID() },
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should delete a medico', async () => {
		vi.mocked(prisma.medicos.delete).mockResolvedValue({
			id: mockRequest.params.id,
		} as any);

		await deleteMedico(mockRequest as any, mockReply as any);

		expect(prisma.medicos.delete).toHaveBeenCalledWith({
			where: { id: mockRequest.params.id },
		});
		expect(mockReply.status).toHaveBeenCalledWith(204);
		expect(mockReply.send).toHaveBeenCalled();
	});
});
