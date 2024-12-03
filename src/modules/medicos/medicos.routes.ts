import { FastifyInstance } from 'fastify';
import { createMedico, deleteMedico, getAllMedicos, getMedicoById, updateMedico } from './medicos.controller';

export async function medicosRoutes(app: FastifyInstance) {
	app.get('/medicos', getAllMedicos);

	app.get('/medicos/:id', getMedicoById);

	app.post('/medicos', createMedico);

	app.put('/medicos/:id', updateMedico);

	app.delete('/medicos/:id', deleteMedico);
}
