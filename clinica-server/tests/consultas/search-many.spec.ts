import { describe, expect, it, vi } from 'vitest';
import { searchMany } from '../../src/http/controllers/consultas/search-many';
import { prisma } from '../../src/lib/prisma';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		consultas: {
			findMany: vi.fn(),
		},
		user: {
			findUnique: vi.fn(),
		},
	},
}));

describe('searchMany', () => {
	const mockRequest = {
		user: {
			role: '',
			id: '',
		},
	};

	const mockReply = {
		send: vi.fn(),
		status: vi.fn().mockReturnThis(),
	};

	it('should return all consultas for ADMIN role', async () => {
		mockRequest.user.role = 'ADMIN';

		await searchMany(mockRequest as any, mockReply as any);

		expect(prisma.consultas.findMany).toHaveBeenCalledTimes(1);
		expect(prisma.consultas.findMany).toHaveBeenCalledWith({
			include: {
				medico: true,
				paciente: true,
				especialidade: true,
			},
		});
		expect(mockReply.send).toHaveBeenCalledTimes(1);
	});

	it('should return consultas for MEDICO role', async () => {
		mockRequest.user.role = 'MEDICO';
		mockRequest.user.id = '1';
		vi.mocked(prisma.user.findUnique).mockResolvedValue({
			medicoId: '1',
		} as any);

		await searchMany(mockRequest as any, mockReply as any);

		expect(prisma.user.findUnique).toHaveBeenCalledWith({
			where: { id: '1' },
			select: { medicoId: true },
		});

		expect(prisma.consultas.findMany).toHaveBeenCalledWith({
			where: {
				id_medico: '1',
			},
			include: {
				paciente: true,
				especialidade: true,
			},
		});
	});

	it('should return consultas for UTENTE role', async () => {
		mockRequest.user.role = 'UTENTE';
		mockRequest.user.id = '1';
		vi.mocked(prisma.user.findUnique).mockResolvedValue({
			pacienteId: '1',
		} as any);
		await searchMany(mockRequest as any, mockReply as any);

		expect(prisma.user.findUnique).toHaveBeenCalledWith({
			where: { id: '1' },
			select: { pacienteId: true },
		});
		expect(prisma.consultas.findMany).toHaveBeenCalledWith({
			where: {
				id_paciente: '1',
			},
			include: {
				medico: {
					select: {
						nome: true,
					},
				},
				especialidade: true,
			},
		});
	});

	it('should return 403 for invalid role', async () => {
		mockRequest.user.role = 'INVALID_ROLE';

		await searchMany(mockRequest as any, mockReply as any);

		expect(mockReply.status).toHaveBeenCalledWith(403);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Acesso não permitido' });
	});

	it('should return 403 for UTENTE role without pacienteId', async () => {
		mockRequest.user.role = 'UTENTE';
		mockRequest.user.id = '1';
        vi.mocked(prisma.user.findUnique).mockResolvedValue({} as any);
        
        await searchMany(mockRequest as any, mockReply as any);
        
		expect(mockReply.status).toHaveBeenCalledWith(403);
		expect(mockReply.send).toHaveBeenCalledWith({ error: 'Usuário não está associado a um paciente válido.' });
	});
});
