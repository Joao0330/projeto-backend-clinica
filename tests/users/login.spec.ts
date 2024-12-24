import { compare } from 'bcrypt';
import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { loginUser } from '../../src/http/controllers/users/login';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		user: {
			findUnique: vi.fn(),
		},
	},
}));

vi.mock('bcrypt', () => ({
	compare: vi.fn().mockResolvedValue(true),
}));

const mockRequest = {
	body: { email: 'test@example.com', password: 'correct_password' },
};

const mockReply = {
	jwtSign: vi.fn(),
	status: vi.fn().mockReturnThis(),
	send: vi.fn(),
};

describe('loginUser', () => {
	it('should be able to login', async () => {
		vi.mocked(prisma.user.findUnique).mockResolvedValue({
			id: '1',
			nome: 'test',
			email: mockRequest.body.email,
			password: 'hashed_password',
			contacto: '123456789',
			morada: 'rua test',
			pacienteId: '1',
			medicoId: null,
			role: 'UTENTE',
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		vi.mocked(compare);

		mockReply.jwtSign.mockResolvedValue('fake-jwt-token');

		await loginUser(mockRequest as any, mockReply as any);

		expect(prisma.user.findUnique).toHaveBeenCalledWith({
			where: { email: mockRequest.body.email },
		});
		expect(compare).toHaveBeenCalledWith(mockRequest.body.password, 'hashed_password');
		expect(mockReply.jwtSign).toHaveBeenCalledWith({
			id: '1',
			role: 'UTENTE',
		});
		expect(mockReply.status).toHaveBeenCalledWith(200);
		expect(mockReply.send).toHaveBeenCalledWith({ token: 'fake-jwt-token' });
	});
});
