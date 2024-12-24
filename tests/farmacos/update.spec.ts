import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { update } from '../../src/http/controllers/farmacos/update';
import { verifyFarmacoWithSameName } from '../../src/lib/verify-farmaco-same-name';
import { randomUUID } from 'crypto';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		farmacos: {
			update: vi.fn(),
		},
	},
}));

vi.mock('../../src/lib/verify-farmaco-same-name', () => ({
	verifyFarmacoWithSameName: vi.fn(),
}));

describe('updateFarmacao', () => {
	const mockRequest = {
		params: { id: randomUUID() },
		body: {
			nome: 'paracetamol',
		},
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should update a farmaco', async () => {
		vi.mocked(verifyFarmacoWithSameName).mockResolvedValue(false);
		vi.mocked(prisma.farmacos.update).mockResolvedValue({
			id: mockRequest.params.id,
			nome: mockRequest.body.nome,
		});

		await update(mockRequest as any, mockReply as any);

		expect(prisma.farmacos.update).toHaveBeenCalledWith({
			where: {
				id: mockRequest.params.id,
			},
			data: {
				nome: mockRequest.body.nome,
			},
		});
		expect(mockReply.send).toHaveBeenCalledWith({
			id: mockRequest.params.id,
			nome: mockRequest.body.nome,
		});
	});

	it('should return 409 error if farmaco with same name exists', async () => {
        vi.mocked(verifyFarmacoWithSameName).mockResolvedValue(true);
        
        await update(mockRequest as any, mockReply as any);
        
		expect(mockReply.status).toHaveBeenCalledWith(409);
		expect(mockReply.send).toHaveBeenCalledWith({
			err: 'Fármaco com este nome já existe!',
		});
	});
});
