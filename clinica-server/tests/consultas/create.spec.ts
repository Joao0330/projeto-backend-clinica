import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { create } from '../../src/http/controllers/consultas/create';
import { verifyPacienteExists } from '../../src/lib/verify-paciente-exists';
import { verifyMedicoExists } from '../../src/lib/verify-medico-exists';
import { verifyEspecialidadeMedico } from '../../src/lib/verify-medico-especialidade';
import { verifySchedule } from '../../src/lib/verify-schedule';
import { createNumeroConsulta } from '../../src/lib/create-numero-consulta';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		user: {
			findUnique: vi.fn(),
		},
		consultas: {
			create: vi.fn(),
		},
	},
}));

vi.mock('../../src/lib/verify-paciente-exists', () => ({
	verifyPacienteExists: vi.fn(),
}));

vi.mock('../../src/lib/verify-medico-exists', () => ({
	verifyMedicoExists: vi.fn(),
}));

vi.mock('../../src/lib/verify-medico-especialidade', () => ({
	verifyEspecialidadeMedico: vi.fn(),
}));

vi.mock('../../src/lib/verify-schedule', () => ({
	verifySchedule: vi.fn(),
}));

vi.mock('../../src/lib/create-numero-consulta', () => ({
	createNumeroConsulta: vi.fn(),
}));

describe('createConsulta', () => {
	const mockRequest = {
		user: {
			role: 'UTENTE',
			id: randomUUID(),
		},
		body: {
			id_medico: randomUUID(),
			id_especialidade: randomUUID(),
			data_inicio: '2024-12-28T14:00:00.000Z',
			data_fim: '2024-12-28T15:00:00.000Z',
		},
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should create a new consulta', async () => {
		vi.mocked(prisma.user.findUnique).mockResolvedValue({
			id: mockRequest.user.id,
			nome: null,
			contacto: null,
			morada: null,
			email: 'test@example.com',
			password: 'hashed_password',
			role: 'UTENTE',
			medicoId: null,
			pacienteId: mockRequest.user.id,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		vi.mocked(verifyPacienteExists).mockResolvedValue(true);
		vi.mocked(verifyMedicoExists).mockResolvedValue(true);
		vi.mocked(verifyEspecialidadeMedico).mockResolvedValue(true);
		vi.mocked(verifySchedule).mockResolvedValue({ conflito: false });
		vi.mocked(createNumeroConsulta).mockResolvedValue(1);
		vi.mocked(prisma.consultas.create).mockResolvedValue({
			id_consulta: randomUUID(),
			id_paciente: mockRequest.user.id,
			id_medico: mockRequest.body.id_medico,
			id_especialidade: mockRequest.body.id_especialidade,
			data_inicio: dayjs(mockRequest.body.data_inicio).toDate(),
			data_fim: dayjs(mockRequest.body.data_fim).toDate(),
			numero_consulta: 1,
		});

		await create(mockRequest as any, mockReply as any);

		expect(prisma.consultas.create).toHaveBeenCalledWith({
			data: {
				id_medico: mockRequest.body.id_medico,
				id_paciente: mockRequest.user.id,
				id_especialidade: mockRequest.body.id_especialidade,
				numero_consulta: 1,
				data_inicio: expect.any(Date),
				data_fim: expect.any(Date),
			},
		});
		expect(mockReply.status).toHaveBeenCalledWith(201);
	});

	it('should return 403 if UTENTE does not have a pacienteId', async () => {
		vi.mocked(prisma.user.findUnique).mockResolvedValue({
			id: mockRequest.user.id,
			nome: null,
			contacto: null,
			morada: null,
			email: 'test@example.com',
			password: 'hashed_password',
			role: 'UTENTE',
			medicoId: null,
			pacienteId: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await create(mockRequest as any, mockReply as any);

		expect(prisma.user.findUnique).toHaveBeenCalledWith({
			where: { id: mockRequest.user.id },
			select: { pacienteId: true },
		});
		expect(mockReply.status).toHaveBeenCalledWith(403);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'O usuário não possui um paciente registrado' });
	});

	it('should return 403 if the role is not UTENTE or ADMIN', async () => {
		mockRequest.user.role = 'INVALID_ROLE';

		await create(mockRequest as any, mockReply as any);

		expect(mockReply.status).toHaveBeenCalledWith(403);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Sem permissão' });
	});
});
