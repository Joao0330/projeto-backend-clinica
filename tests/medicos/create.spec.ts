import { hash } from 'bcrypt';
import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { create } from '../../src/http/controllers/medicos/create';
import { verifyUserExists } from '../../src/lib/verify-user-exists';
import { verifyContact } from '../../src/lib/verify-contact';
import { createNumeroEmpregado } from '../../src/lib/create-numero-empregado';
import { randomUUID } from 'crypto';

vi.mock('bcrypt', () => ({
	hash: vi.fn().mockResolvedValue('hashed_password'),
}));

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		medicos: {
			create: vi.fn(),
		},
	},
}));

vi.mock('../../src/lib/verify-user-exists', () => ({
	verifyUserExists: vi.fn(),
}));

vi.mock('../../src/lib/verify-contact', () => ({
	verifyContact: vi.fn(),
}));

vi.mock('../../src/lib/create-numero-empregado', () => ({
	createNumeroEmpregado: vi.fn(),
}));

describe('createMedico', () => {
	const mockRequest = {
		params: { id: '1' },
		body: {
			nome: 'test',
			email: 'test@example.com',
			password: '123456',
			contacto: '123456789',
			morada: 'rua test',
		},
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should create a new medico', async () => {
		vi.mocked(verifyUserExists).mockResolvedValue(false);
		vi.mocked(verifyContact).mockResolvedValue(false);
		vi.mocked(createNumeroEmpregado).mockResolvedValue(1);
		vi.mocked(hash);
		vi.mocked(prisma.medicos.create).mockResolvedValue({
			id: randomUUID(),
			nome: mockRequest.body.nome,
			contacto: mockRequest.body.contacto,
			morada: mockRequest.body.morada,
			numero_empregado: 1,
		});

		await create(mockRequest as any, mockReply as any);

		expect(verifyUserExists).toHaveBeenCalledWith('test@example.com');
		expect(verifyContact).toHaveBeenCalledWith('123456789', 'medicos');
		expect(createNumeroEmpregado).toHaveBeenCalledWith('1');
		expect(hash).toHaveBeenCalledWith('123456', 6);
		expect(prisma.medicos.create).toHaveBeenCalledWith({
			data: {
				nome: mockRequest.body.nome,
				contacto: mockRequest.body.contacto,
				morada: mockRequest.body.morada,
				numero_empregado: 1,
				User: {
					create: {
						nome: mockRequest.body.nome,
						contacto: mockRequest.body.contacto,
						morada: mockRequest.body.morada,
						email: mockRequest.body.email,
						password: 'hashed_password',
						role: 'MEDICO',
					},
				},
			},
			include: {
				User: true,
			},
		});
		expect(mockReply.status).toHaveBeenCalledWith(201);
	});

	it('should return a 409 error if the email is already registered', async () => {
		vi.mocked(verifyUserExists).mockResolvedValue(true);

		await create(mockRequest as any, mockReply as any);

		expect(verifyUserExists).toHaveBeenCalledWith('test@example.com');
		expect(mockReply.status).toHaveBeenCalledWith(409);
		expect(mockReply.send).toHaveBeenCalledWith({ error: 'E-mail já cadastrado' });
	});

	it('should return a 409 error if the contact is already registered', async () => {
		vi.mocked(verifyUserExists).mockResolvedValue(false);
		vi.mocked(verifyContact).mockResolvedValue(true);

		await create(mockRequest as any, mockReply as any);

		expect(verifyContact).toHaveBeenCalledWith('123456789', 'medicos');
		expect(mockReply.status).toHaveBeenCalledWith(409);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Contacto ja cadastrado' });
	});
});
