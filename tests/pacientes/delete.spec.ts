import { describe, expect, it, vi } from 'vitest';
import { deletePaciente } from '../../src/http/controllers/pacientes/delete';
import { prisma } from '../../src/lib/prisma';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		pacientes: {
			delete: vi.fn(),
		},
	},
}));

describe('deletePaciente', () => {
	const mockRequest = {
		params: { id: '1' },
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should delete a paciente', async () => {
		vi.mocked(prisma.pacientes.delete).mockResolvedValue({
			id: '1',
			nome: null,
			contacto: null,
			morada: null,
		});
		await deletePaciente(mockRequest as any, mockReply as any);

		expect(prisma.pacientes.delete).toHaveBeenCalledWith({
			where: { id: '1' },
		});
		expect(mockReply.status).toHaveBeenCalledWith(204);
		expect(mockReply.send).toHaveBeenCalled();
	});
});
