import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { verifyConsultaExists } from '../../src/lib/verify-consulta-exists';
import { verifyFarmacoExists } from '../../src/lib/verify-farmaco-exists';
import { verifyFarmacoIsPrescripted } from '../../src/lib/verify-farmaco-is-prescripted';
import { create } from '../../src/http/controllers/receitas/create';
import { randomUUID } from 'crypto';

vi.mock('../../src/lib/prisma', () => ({
	prisma: {
		receita: {
			create: vi.fn(),
		},
	},
}));

vi.mock('../../src/lib/verify-consulta-exists', () => ({
	verifyConsultaExists: vi.fn(),
}));

vi.mock('../../src/lib/verify-farmaco-exists', () => ({
	verifyFarmacoExists: vi.fn(),
}));

vi.mock('../../src/lib/verify-farmaco-is-prescripted', () => ({
	verifyFarmacoIsPrescripted: vi.fn(),
}));

describe('createReceita', () => {
	const mockRequest = {
		body: {
			id_consulta_medico: randomUUID(),
			id_consulta: randomUUID(),
			id_farmaco: randomUUID(),
		},
	};

	const mockReply = {
		status: vi.fn().mockReturnThis(),
		send: vi.fn(),
	};

	it('should create a new receita', async () => {
		vi.mocked(verifyConsultaExists).mockResolvedValue(true);
		vi.mocked(verifyFarmacoExists).mockResolvedValue(true);
		vi.mocked(verifyFarmacoIsPrescripted).mockResolvedValue(false);
		vi.mocked(prisma.receita.create).mockResolvedValue({
			id_consulta_medico: mockRequest.body.id_consulta_medico,
			id_consulta: mockRequest.body.id_consulta,
			id_farmaco: mockRequest.body.id_farmaco,
			data_receita: new Date(),
		});

		await create(mockRequest as any, mockReply as any);

		expect(mockReply.status).toHaveBeenCalledWith(201);
		expect(prisma.receita.create).toHaveBeenCalledWith({
			data: {
				id_consulta_medico: mockRequest.body.id_consulta_medico,
				id_consulta: mockRequest.body.id_consulta,
				id_farmaco: mockRequest.body.id_farmaco,
			},
		});
	});

	it('should return 404 error if consulta not found', async () => {
		vi.mocked(verifyConsultaExists).mockResolvedValue(false);

		await create(mockRequest as any, mockReply as any);

		expect(mockReply.status).toHaveBeenCalledWith(404);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Consulta não encontrada' });
	});

	it('should return 404 error if farmaco not found', async () => {
		vi.mocked(verifyConsultaExists).mockResolvedValue(true);
		vi.mocked(verifyFarmacoExists).mockResolvedValue(false);

		await create(mockRequest as any, mockReply as any);

		expect(mockReply.status).toHaveBeenCalledWith(404);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Fármaco nao encontrado' });
	});

	it('should return 409 error if farmaco was prescripted', async () => {
		vi.mocked(verifyConsultaExists).mockResolvedValue(true);
		vi.mocked(verifyFarmacoExists).mockResolvedValue(true);
		vi.mocked(verifyFarmacoIsPrescripted).mockResolvedValue(true);

		await create(mockRequest as any, mockReply as any);

		expect(mockReply.status).toHaveBeenCalledWith(409);
		expect(mockReply.send).toHaveBeenCalledWith({ err: 'Fármaco ja foi receitado' });
	});
});
