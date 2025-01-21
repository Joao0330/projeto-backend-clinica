import { FastifyInstance } from 'fastify';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { verifyUserRole } from '../../middlewares/verify-user-role';
import { searchMany } from './search-many';
import { pacientesParams } from './pacientes.types';
import { searchOne } from './search-one';
import { create } from './create';
import { update } from './update';
import { deletePaciente } from './delete';

export async function pacientesRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt);

	app.get('/pacientes', { onRequest: [verifyUserRole('ADMIN', "UTENTE", "MEDICO")] }, searchMany);

	app.get<{ Params: pacientesParams }>('/pacientes/:id', { onRequest: [verifyUserRole('MEDICO')] }, searchOne);

	app.post('/pacientes', { onRequest: [verifyUserRole('ADMIN')] }, create);

	app.put<{ Params: pacientesParams }>('/pacientes/:id', { onRequest: [verifyUserRole('ADMIN')] }, update);

	app.delete<{ Params: pacientesParams }>('/pacientes/:id', { onRequest: [verifyUserRole('ADMIN')] }, deletePaciente);
}
