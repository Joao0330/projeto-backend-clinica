import { FastifyInstance } from 'fastify';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { verifyUserRole } from '../../middlewares/verify-user-role';
import { searchMany } from './search-many';
import { searchOne } from './search-one';
import { create } from './create';
import { update } from './update';
import { especialidadesParams } from './especialidades.types';
import { deleteEspecialidade } from './delete';

export async function especialidadesRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt);

	app.get('/especialidades', { onRequest: [verifyUserRole('ADMIN', 'MEDICO')] }, searchMany);

	app.get<{ Params: especialidadesParams }>('/especialidades/:id', { onRequest: [verifyUserRole('ADMIN', 'MEDICO')] }, searchOne);

	app.post('/especialidades', { onRequest: [verifyUserRole('ADMIN')] }, create);

	app.put<{ Params: especialidadesParams }>('/especialidades/:id', { onRequest: [verifyUserRole('ADMIN')] }, update);

	app.delete<{ Params: especialidadesParams }>('/especialidades/:id', { onRequest: [verifyUserRole('ADMIN')] }, deleteEspecialidade);
}
