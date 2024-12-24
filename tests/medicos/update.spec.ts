import { describe, expect, it, vi } from 'vitest';
import { update } from '../../src/http/controllers/medicos/update';
import { verifyContact } from '../../src/lib/verify-contact';
import { prisma } from '../../src/lib/prisma';
import { randomUUID } from 'crypto';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		medicos: {
			update: vi.fn(),
		},
	},
}));

vi.mock('../../src/lib/verify-contact', () => ({
	verifyContact: vi.fn(),
}));

describe('updateMedico', () => {
	const mockRequest = {
		params: { id: "1" },
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

	it('should update a medico', async () => {
		vi.mocked(verifyContact).mockResolvedValue(false);
		vi.mocked(prisma.medicos.update).mockResolvedValue({
			id: mockRequest.params.id,
			nome: mockRequest.body.nome,
			contacto: mockRequest.body.contacto,
			morada: mockRequest.body.morada,
			numero_empregado: 1,
		});

		await update(mockRequest as any, mockReply as any);

		expect(verifyContact).toHaveBeenCalledWith(mockRequest.body.contacto, 'medicos');
		expect(prisma.medicos.update).toHaveBeenCalledWith({
			where: { id: mockRequest.params.id },
			data: {
				nome: mockRequest.body.nome,
				contacto: mockRequest.body.contacto,
				morada: mockRequest.body.morada,
				User: {
					updateMany: {
						where: { medicoId: mockRequest.params.id },
						data: {
							nome: mockRequest.body.nome,
							contacto: mockRequest.body.contacto,
							morada: mockRequest.body.morada,
						},
					},
				},
			},
			include: {
				User: true,
			},
		});
		expect(mockReply.send).toHaveBeenCalledWith({
			id: mockRequest.params.id,
			nome: mockRequest.body.nome,
			contacto: mockRequest.body.contacto,
			morada: mockRequest.body.morada,
			numero_empregado: 1,
		});
    });
    
    it('should return a 409 error if the contact is already registered', async () => {
            vi.mocked(verifyContact).mockResolvedValue(true);
    
            await update(mockRequest as any, mockReply as any);
    
            expect(verifyContact).toHaveBeenCalledWith(mockRequest.body.contacto, 'medicos');
            expect(mockReply.status).toHaveBeenCalledWith(409);
            expect(mockReply.send).toHaveBeenCalledWith({ err: 'Contacto ja cadastrado' });
        });
});
