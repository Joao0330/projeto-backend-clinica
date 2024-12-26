import { describe, expect, it, vi } from 'vitest';
import { deletePaciente } from '../../src/http/controllers/pacientes/delete';
import { prisma } from '../../src/lib/prisma';
import { randomUUID } from 'crypto';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		pacientes: {
			delete: vi.fn(),
		},
	},
}));

describe('deletePaciente', () => {
	const mockRequest = {
		params: { id: randomUUID() },
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should delete a paciente', async () => {
		vi.mocked(prisma.pacientes.delete).mockResolvedValue({
			id: mockRequest.params.id,
		} as any);
		await deletePaciente(mockRequest as any, mockReply as any);

		expect(prisma.pacientes.delete).toHaveBeenCalledWith({
			where: { id: mockRequest.params.id },
		});
		expect(mockReply.status).toHaveBeenCalledWith(204);
		expect(mockReply.send).toHaveBeenCalled();
	});
});
