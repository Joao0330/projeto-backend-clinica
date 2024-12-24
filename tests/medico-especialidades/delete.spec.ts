import { describe, expect, it, vi } from 'vitest';
import { deleteMedicoEspecialidade } from '../../src/http/controllers/medico-especialidades/delete';
import { prisma } from '../../src/lib/prisma';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		medicoEspecialidades: {
			delete: vi.fn(),
		},
	},
}));

describe('deleteMedicoEspecialidade', () => {
	const mockRequest = {
		params: {
			id_medico: '1',
			id_especialidade: '1',
		},
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should delete a medico-especialidade', async () => {
		vi.mocked(prisma.medicoEspecialidades.delete).mockResolvedValue({
			id_medico: mockRequest.params.id_medico,
			id_especialidade: mockRequest.params.id_especialidade,
		});

		await deleteMedicoEspecialidade(mockRequest as any, mockReply as any);

		expect(prisma.medicoEspecialidades.delete).toHaveBeenCalledWith({
			where: {
				id_medico_id_especialidade: {
					id_medico: '1',
					id_especialidade: '1',
				},
			},
		});
		expect(mockReply.status).toHaveBeenCalledWith(204);
		expect(mockReply.send).toHaveBeenCalled();
	});
});
