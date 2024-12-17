import { FastifyInstance } from 'fastify';
import { createReceita, deleteReceita, getReceitaByConsulta, receitasParams } from './receitas.controller';
import { verifyJwt } from '../../http/middlewares/verify-jwt';
import { verifyUserRole } from '../../http/middlewares/verify-user-role';

export async function receitasRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt);

	app.get<{ Params: receitasParams }>('/receitas/:id_consulta_medico/:id_consulta', { onRequest: [verifyUserRole('MEDICO')] }, getReceitaByConsulta);

	app.post('/receitas', { onRequest: [verifyUserRole('MEDICO')] }, createReceita);

	app.delete<{ Params: receitasParams }>('/receitas/:id_consulta_medico/:id_consulta/:id_farmaco', { onRequest: [verifyUserRole('MEDICO', 'ADMIN')] }, deleteReceita);
}
