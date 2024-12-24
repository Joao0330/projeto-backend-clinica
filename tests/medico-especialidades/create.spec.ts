import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { create } from '../../src/http/controllers/medico-especialidades/create';
import { verifyMedicoExists } from '../../src/lib/verify-medico-exists';
import { verifyEspecialidadeExists } from '../../src/lib/verify-especialidade-exists';
import { verifyEspecialidadeIsAssociated } from '../../src/lib/verify-especialidade-is-associated';
import { randomUUID } from 'crypto';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		medicoEspecialidades: {
			create: vi.fn(),
		},
	},
}));

vi.mock('../../src/lib/verify-medico-exists', () => ({
	verifyMedicoExists: vi.fn(),
}));

vi.mock('../../src/lib/verify-especialidade-exists', () => ({
	verifyEspecialidadeExists: vi.fn(),
}));

vi.mock('../../src/lib/verify-especialidade-is-associated', () => ({
	verifyEspecialidadeIsAssociated: vi.fn(),
}));

describe('createMedicoEspecialidade', () => {
	const mockRequest = {
		body: {
			id_medico: randomUUID(),
			id_especialidade: randomUUID(),
		},
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should create a new relation between medico and especialidade', async () => {
		vi.mocked(verifyMedicoExists).mockResolvedValue(true);
		vi.mocked(verifyEspecialidadeExists).mockResolvedValue(true);
		vi.mocked(verifyEspecialidadeIsAssociated).mockResolvedValue(false);
		vi.mocked(prisma.medicoEspecialidades.create).mockResolvedValue({
			id_medico: mockRequest.body.id_medico,
			id_especialidade: mockRequest.body.id_especialidade,
		});

		await create(mockRequest as any, mockReply as any);

		expect(mockReply.status).toHaveBeenCalledWith(201);
		expect(prisma.medicoEspecialidades.create).toHaveBeenCalledWith({
			data: {
				id_medico: mockRequest.body.id_medico,
				id_especialidade: mockRequest.body.id_especialidade,
			},
		});
	});

	it('should return 404 error if medico not found', async () => {
		vi.mocked(verifyMedicoExists).mockResolvedValue(false);

		await create(mockRequest as any, mockReply as any);

		expect(mockReply.status).toHaveBeenCalledWith(404);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Médico nao encontrado' });
	});

	it('should return 404 error if especialidade not found', async () => {
		vi.mocked(verifyMedicoExists).mockResolvedValue(true);
		vi.mocked(verifyEspecialidadeExists).mockResolvedValue(false);

		await create(mockRequest as any, mockReply as any);

		expect(mockReply.status).toHaveBeenCalledWith(404);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Especialidade nao encontrada' });
	});

	it('should return 400 if medico is already associated with especialidade', async () => {
		vi.mocked(verifyMedicoExists).mockResolvedValue(true);
		vi.mocked(verifyEspecialidadeExists).mockResolvedValue(true);
        vi.mocked(verifyEspecialidadeIsAssociated).mockResolvedValue(true);
        
        await create(mockRequest as any, mockReply as any);
        
		expect(mockReply.status).toHaveBeenCalledWith(400);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'O médico já está associado a esta especialidade' });
	});
});
