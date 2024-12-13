import { FastifyInstance } from 'fastify';
import { createConsulta, deleteConsulta, ConsultaParams, getAllConsultas, updateConsulta } from './consultas.controller';
import { verifyUserRole } from '../../http/middlewares/verify-user-role';
import { verifyJwt } from '../../http/middlewares/verify-jwt';

export async function consultasRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt);

	app.get('/consultas', getAllConsultas);

	app.post('/consultas', { onRequest: [verifyUserRole('ADMIN', 'UTENTE')] }, createConsulta);

	app.put<{ Params: ConsultaParams }>('/consultas/:id_medico/:id_consulta', { onRequest: [verifyUserRole('ADMIN', 'MEDICO')] }, updateConsulta);

	app.delete<{ Params: ConsultaParams }>('/consultas/:id_medico/:id_consulta', { onRequest: [verifyUserRole('ADMIN')] }, deleteConsulta);
}
