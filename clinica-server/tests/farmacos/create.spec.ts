import { describe, expect, it, vi } from 'vitest';
import { verifyFarmacoWithSameName } from '../../src/lib/verify-farmaco-same-name';
import { create } from '../../src/http/controllers/farmacos/create';
import { prisma } from '../../src/lib/prisma';
import { randomUUID } from 'crypto';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		farmacos: {
			create: vi.fn(),
		},
	},
}));

vi.mock('../../src/lib/verify-farmaco-same-name', () => ({
	verifyFarmacoWithSameName: vi.fn(),
}));

describe('createFarmaco', () => {
	const mockRequest = {
		body: {
			nome: 'paracetamol',
		},
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should create a new farmaco', async () => {
		vi.mocked(verifyFarmacoWithSameName).mockResolvedValue(false);
		vi.mocked(prisma.farmacos.create).mockResolvedValue({
			id: randomUUID(),
			nome: mockRequest.body.nome,
		});

		await create(mockRequest as any, mockReply as any);

		expect(prisma.farmacos.create).toHaveBeenCalledWith({
			data: {
				nome: mockRequest.body.nome,
			},
		});
		expect(mockReply.status).toHaveBeenCalledWith(201);
	});

	it('should return a 409 error if farmaco exists', async () => {
		vi.mocked(verifyFarmacoWithSameName).mockResolvedValue(true);

		await create(mockRequest as any, mockReply as any);

		expect(mockReply.status).toHaveBeenCalledWith(409);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Fármaco com este nome já existe!' });
	});
});
