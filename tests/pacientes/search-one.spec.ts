import { describe, expect, it, vi } from 'vitest';
import { searchOne } from '../../src/http/controllers/pacientes/search-one';
import { prisma } from '../../src/lib/prisma';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		user: {
			findUnique: vi.fn(),
		},
		consultas: {
			findFirst: vi.fn(),
		},
		pacientes: {
			findUnique: vi.fn(),
		},
	},
}));

describe('searchOne', () => {
	const mockRequest = {
		params: { id: '1' },
		user: { id: '1' },
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should return patient data', async () => {
		vi.mocked(prisma.consultas.findFirst).mockResolvedValue({
			id_medico: '1',
			id_especialidade: '1',
			id_consulta: '1',
			id_paciente: '1',
			numero_consulta: 1,
			data_inicio: new Date(),
			data_fim: new Date(),
		});
		vi.mocked(prisma.pacientes.findUnique).mockResolvedValue({
			id: '1',
			nome: 'Paciente 1',
			contacto: null,
			morada: null,
		});

		await searchOne(mockRequest as any, mockReply as any);

		expect(mockReply.send).toHaveBeenCalledWith({
			id: '1',
			nome: 'Paciente 1',
			contacto: null,
			morada: null,
		});
	});

	it('should return 403 error if medic has no relation with patient', async () => {
		vi.mocked(prisma.consultas.findFirst).mockResolvedValue(null);

		await searchOne(mockRequest as any, mockReply as any);

		expect(mockReply.status).toHaveBeenCalledWith(403);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Você não tem consulta marcada com este paciente.' });
	});

	it('should return 404 error if patient not found', async () => {
		vi.mocked(prisma.consultas.findFirst).mockResolvedValue({
			id_medico: '1',
			id_especialidade: '1',
			id_consulta: '1',
			id_paciente: '1',
			numero_consulta: 1,
			data_inicio: new Date(),
			data_fim: new Date(),
		});
		vi.mocked(prisma.pacientes.findUnique).mockResolvedValue(null);

		await searchOne(mockRequest as any, mockReply as any);

		expect(mockReply.status).toHaveBeenCalledWith(404);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Paciente nao encontrado' });
	});
});
