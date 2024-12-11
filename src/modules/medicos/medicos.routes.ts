import { FastifyInstance } from 'fastify';
import { createMedico, deleteMedico, getAllMedicos, getMedicoById, medicoParams, updateMedico } from './medicos.controller';
import { verifyJwt } from '../../http/middlewares/verify-jwt';
import { verifyUserRole } from '../../http/middlewares/verify-user-role';

export async function medicosRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt);

	app.get('/medicos', getAllMedicos);

	app.get('/medicos/:id', getMedicoById);

	app.post('/medicos', { onRequest: [verifyUserRole('ADMIN')] }, createMedico);

	app.put<{ Params: medicoParams }>('/medicos/:id', { onRequest: [verifyUserRole('ADMIN')] }, updateMedico);

	app.delete<{ Params: medicoParams }>('/medicos/:id', { onRequest: [verifyUserRole('ADMIN')] }, deleteMedico);
}
