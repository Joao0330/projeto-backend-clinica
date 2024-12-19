import { FastifyInstance } from 'fastify';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { verifyUserRole } from '../../middlewares/verify-user-role';
import { receitasParams } from './receitas.types';
import { searchByConsulta } from './search-by-consulta';
import { create } from './create';
import { deleteReceita } from './delete';

export async function receitasRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt);

	app.get<{ Params: receitasParams }>('/receitas/:id_consulta_medico/:id_consulta', { onRequest: [verifyUserRole('MEDICO')] }, searchByConsulta);

	app.post('/receitas', { onRequest: [verifyUserRole('MEDICO')] }, create);

	app.delete<{ Params: receitasParams }>('/receitas/:id_consulta_medico/:id_consulta/:id_farmaco', { onRequest: [verifyUserRole('MEDICO', 'ADMIN')] }, deleteReceita);
}
