import { describe, expect, it, vi } from 'vitest';
import { searchMany } from '../../src/http/controllers/pacientes/search-many';
import { prisma } from '../../src/lib/prisma';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		pacientes: {
			findMany: vi.fn(),
		},
	},
}));

describe('searchMany', () => {
	const mockRequest = {};

	const mockReply = {
		send: vi.fn(),
	};

	it('should search for all pacientes', async () => {
		vi.mocked(prisma.pacientes.findMany).mockResolvedValue([
			{ id: '1', nome: 'Paciente 1', contacto: '123456789', morada: 'Rua 1' },
			{ id: '2', nome: 'Paciente 2', contacto: '987654321', morada: 'Rua 2' },
		]);

		await searchMany(mockRequest as any, mockReply as any);

		expect(prisma.pacientes.findMany).toHaveBeenCalled();
		expect(mockReply.send).toHaveBeenCalledWith([
			{ id: '1', nome: 'Paciente 1', contacto: '123456789', morada: 'Rua 1' },
			{ id: '2', nome: 'Paciente 2', contacto: '987654321', morada: 'Rua 2' },
		]);
	});
});
