import { describe, expect, it, vi } from 'vitest';
import { deleteMedico } from '../../src/http/controllers/medicos/delete';
import { prisma } from '../../src/lib/prisma';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		medicos: {
			delete: vi.fn(),
		},
	},
}));

describe('deleteMedico', () => {
	const mockRequest = {
		params: { id: '1' },
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should delete a medico', async () => {
		vi.mocked(prisma.medicos.delete).mockResolvedValue({
			id: '1',
			nome: null,
			contacto: null,
			morada: null,
			numero_empregado: 1,
		});

		await deleteMedico(mockRequest as any, mockReply as any);

		expect(prisma.medicos.delete).toHaveBeenCalledWith({
			where: { id: '1' },
		});
		expect(mockReply.status).toHaveBeenCalledWith(204);
		expect(mockReply.send).toHaveBeenCalled();
	});
});
