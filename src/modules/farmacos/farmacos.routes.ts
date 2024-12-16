import { FastifyInstance } from 'fastify';
import { createFarmaco, deleteFarmaco, farmacosParams, getAllFarmacos, getFarmaco, updateFarmaco } from './farmacos.controller';
import { verifyJwt } from '../../http/middlewares/verify-jwt';
import { verifyUserRole } from '../../http/middlewares/verify-user-role';

export async function farmacosRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt);

	app.get('/farmacos', { onRequest: [verifyUserRole('MEDICO', 'ADMIN')] }, getAllFarmacos);

	app.get<{ Params: farmacosParams }>('/farmacos/:id', { onRequest: [verifyUserRole('MEDICO', 'ADMIN')] }, getFarmaco);

	app.post('/farmacos', { onRequest: [verifyUserRole('ADMIN')] }, createFarmaco);

	app.put<{ Params: farmacosParams }>('/farmacos/:id', { onRequest: [verifyUserRole('ADMIN')] }, updateFarmaco);

	app.delete<{ Params: farmacosParams }>('/farmacos/:id', { onRequest: [verifyUserRole('ADMIN')] }, deleteFarmaco);
}
