import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { update } from '../../src/http/controllers/pacientes/update';
import { verifyContact } from '../../src/lib/verify-contact';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		pacientes: {
			update: vi.fn(),
		},
	},
}));

vi.mock('../../src/lib/verify-contact', () => ({
	verifyContact: vi.fn(),
}));

describe('updatePaciente', () => {
	const mockRequest = {
		params: { id: '1' },
		body: {
			nome: 'test',
			contacto: '123456789',
			morada: 'rua test',
		},
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should update a paciente', async () => {
		vi.mocked(verifyContact).mockResolvedValue(false);
		vi.mocked(prisma.pacientes.update).mockResolvedValue({
			id: '1',
			nome: mockRequest.body.nome,
			contacto: mockRequest.body.contacto,
			morada: mockRequest.body.morada,
		});

		await update(mockRequest as any, mockReply as any);

		expect(verifyContact).toHaveBeenCalledWith('123456789', 'pacientes');
		expect(prisma.pacientes.update).toHaveBeenCalledWith({
			where: { id: '1' },
			data: {
				nome: mockRequest.body.nome,
				contacto: mockRequest.body.contacto,
				morada: mockRequest.body.morada,
				User: {
					updateMany: {
						where: { pacienteId: '1' },
						data: {
							nome: mockRequest.body.nome,
							contacto: mockRequest.body.contacto,
							morada: mockRequest.body.morada,
						},
					},
				},
			},
		});
		expect(mockReply.send).toHaveBeenCalledWith({
			id: '1',
			nome: 'test',
			contacto: '123456789',
			morada: 'rua test',
		});
	});

	it('should return a 409 error if the contact is already registered', async () => {
		vi.mocked(verifyContact).mockResolvedValue(true);

		await update(mockRequest as any, mockReply as any);

		expect(verifyContact).toHaveBeenCalledWith('123456789', 'pacientes');
		expect(mockReply.status).toHaveBeenCalledWith(409);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Contacto ja cadastrado' });
	});
});
