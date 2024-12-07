import { FastifyInstance } from 'fastify';
import { createReceita, deleteReceita, getReceitaByConsulta } from './receitas.controller';

export async function receitasRoutes(app: FastifyInstance) {
	app.get('/receitas/:id_consulta_medico/:id_consulta', getReceitaByConsulta);

	app.post('/receitas', createReceita);

	app.delete('/receitas', deleteReceita);
}
