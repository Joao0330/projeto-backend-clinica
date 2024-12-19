import { FastifyInstance } from 'fastify';
import { verifyUserRole } from '../../middlewares/verify-user-role';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { searchMany } from './searchMany';
import { create } from './create';
import { ConsultaParams } from './consultas.types';
import { update } from './update';
import { deleteConsulta } from './delete';

export async function consultasRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt);

	app.get('/consultas', searchMany);

	app.post('/consultas', { onRequest: [verifyUserRole('ADMIN', 'UTENTE')] }, create);

	app.put<{ Params: ConsultaParams }>('/consultas/:id_medico/:id_consulta', { onRequest: [verifyUserRole('ADMIN', 'MEDICO')] }, update);

	app.delete<{ Params: ConsultaParams }>('/consultas/:id_medico/:id_consulta', { onRequest: [verifyUserRole('ADMIN')] }, deleteConsulta);
}
