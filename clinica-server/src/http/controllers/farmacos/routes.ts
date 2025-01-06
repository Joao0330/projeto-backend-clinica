import { FastifyInstance } from 'fastify';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { verifyUserRole } from '../../middlewares/verify-user-role';
import { searchMany } from './search-many';
import { farmacosParams } from './farmacos.types';
import { searchOne } from './search-one';
import { create } from './create';
import { update } from './update';
import { deleteFarmaco } from './delete';

export async function farmacosRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt);

	app.get('/farmacos', { onRequest: [verifyUserRole('MEDICO', 'ADMIN')] }, searchMany);

	app.get<{ Params: farmacosParams }>('/farmacos/:id', { onRequest: [verifyUserRole('MEDICO', 'ADMIN')] }, searchOne);

	app.post('/farmacos', { onRequest: [verifyUserRole('ADMIN')] }, create);

	app.put<{ Params: farmacosParams }>('/farmacos/:id', { onRequest: [verifyUserRole('ADMIN')] }, update);

	app.delete<{ Params: farmacosParams }>('/farmacos/:id', { onRequest: [verifyUserRole('ADMIN')] }, deleteFarmaco);
}
