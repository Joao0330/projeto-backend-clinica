// test/unit/controllers/users/registerUser.test.ts
import { describe, it, vi, expect } from 'vitest';
import { registerUser } from '../../src/http/controllers/users/register';
import { prisma } from '../../src/lib/prisma';
import { hash } from 'bcrypt';
import { verifyUserExists } from '../../src/lib/verify-user-exists';
import { verifyContact } from '../../src/lib/verify-contact';

vi.mock('bcrypt', () => ({
	hash: vi.fn().mockResolvedValue('hashed_password'),
}));

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		user: {
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

describe('registerUser', () => {
	const mockRequest = {
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

	it('should register a new user', async () => {
		vi.mocked(verifyUserExists).mockResolvedValue(false);
		vi.mocked(verifyContact).mockResolvedValue(false);
		vi.mocked(hash);
		vi.mocked(prisma.user.create).mockResolvedValue({
			id: '1',
			nome: 'test',
			email: 'test@example.com',
			password: 'hashed_password',
			contacto: '123456789',
			morada: 'rua test',
			pacienteId: '1',
			medicoId: null,
			role: 'UTENTE',
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await registerUser(mockRequest as any, mockReply as any);

		expect(verifyUserExists).toHaveBeenCalledWith('test@example.com');
		expect(verifyContact).toHaveBeenCalledWith('123456789', 'pacientes');
		expect(hash).toHaveBeenCalledWith('123456', 6);
		expect(prisma.user.create).toHaveBeenCalledWith({
			data: {
				nome: 'test',
				email: 'test@example.com',
				password: 'hashed_password',
				paciente: {
					create: {
						nome: 'test',
						contacto: '123456789',
						morada: 'rua test',
					},
				},
			},
			include: {
				paciente: true,
			},
		});
		expect(mockReply.status).toHaveBeenCalledWith(201);
		expect(mockReply.send).toHaveBeenCalledWith({
			user: expect.any(Object),
		});
	});

	it('should return a 409 error if the email is already registered', async () => {
		vi.mocked(verifyUserExists).mockResolvedValue(true);

		await registerUser(mockRequest as any, mockReply as any);

		expect(verifyUserExists).toHaveBeenCalledWith('test@example.com');
		expect(mockReply.status).toHaveBeenCalledWith(409);
		expect(mockReply.send).toHaveBeenCalledWith({ error: 'E-mail já cadastrado' });
	});

	it('should return a 409 error if the contact is already registered', async () => {
		vi.mocked(verifyUserExists).mockResolvedValue(false);
		vi.mocked(verifyContact).mockResolvedValue(true);

		await registerUser(mockRequest as any, mockReply as any);

		expect(verifyContact).toHaveBeenCalledWith('123456789', 'pacientes');
		expect(mockReply.status).toHaveBeenCalledWith(409);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Contacto ja cadastrado' });
	});
});
