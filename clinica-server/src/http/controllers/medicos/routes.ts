import { FastifyInstance } from 'fastify';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { verifyUserRole } from '../../middlewares/verify-user-role';
import { searchMany } from './search-many';
import { medicoParams } from './medicos.types';
import { searchOne } from './search-one';
import { create } from './create';
import { update } from './update';
import { deleteMedico } from './delete';

export async function medicosRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt);

	app.get('/medicos', { onRequest: [verifyUserRole('ADMIN', "UTENTE", "MEDICO")] }, searchMany);

	app.get<{ Params: medicoParams }>('/medicos/:id', { onRequest: [verifyUserRole('ADMIN')] }, searchOne);

	app.post<{ Params: medicoParams }>('/medicos', { onRequest: [verifyUserRole('ADMIN')] }, create);

	app.put<{ Params: medicoParams }>('/medicos/:id', { onRequest: [verifyUserRole('ADMIN')] }, update);

	app.delete<{ Params: medicoParams }>('/medicos/:id', { onRequest: [verifyUserRole('ADMIN')] }, deleteMedico);
}
