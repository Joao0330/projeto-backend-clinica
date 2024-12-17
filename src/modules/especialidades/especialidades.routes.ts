import { FastifyInstance } from 'fastify';
import { createEspecialidade, deleteEspecialidade, especialidadesParams, getAllEspecialidades, getEspecialidade, updateEspecialidade } from './especialidades.controller';
import { verifyJwt } from '../../http/middlewares/verify-jwt';
import { verifyUserRole } from '../../http/middlewares/verify-user-role';

export async function especialidadesRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt);

	app.get('/especialidades', { onRequest: [verifyUserRole('ADMIN', 'MEDICO')] }, getAllEspecialidades);

	app.get<{ Params: especialidadesParams }>('/especialidades/:id', { onRequest: [verifyUserRole('ADMIN', 'MEDICO')] }, getEspecialidade);

	app.post('/especialidades', { onRequest: [verifyUserRole('ADMIN')] }, createEspecialidade);

	app.put<{ Params: especialidadesParams }>('/especialidades/:id', { onRequest: [verifyUserRole('ADMIN')] }, updateEspecialidade);

	app.delete<{ Params: especialidadesParams }>('/especialidades/:id', { onRequest: [verifyUserRole('ADMIN')] }, deleteEspecialidade);
}
