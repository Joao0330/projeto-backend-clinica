import { FastifyInstance } from 'fastify';
import { createConsulta, deleteConsulta, ConsultaParams, getAllConsultas, getConsulta, updateConsulta } from './consultas.controller';
import { verifyUserRole } from '../../http/middlewares/verify-user-role';
import { verifyJwt } from '../../http/middlewares/verify-jwt';

export async function consultasRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt);

	app.get('/consultas', getAllConsultas);

	app.get('/consultas/:id_medico/:id_consulta', getConsulta);

	app.post('/consultas', createConsulta);

	app.put('/consultas/:id_medico/:id_consulta', updateConsulta);

	app.delete<{ Params: ConsultaParams }>('/consultas/:id_medico/:id_consulta', { onRequest: [verifyUserRole('ADMIN')] }, deleteConsulta);
}
