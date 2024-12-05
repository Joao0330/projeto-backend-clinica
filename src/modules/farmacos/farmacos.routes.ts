import { FastifyInstance } from 'fastify';
import { createFarmaco, deleteFarmaco, getAllFarmacos, getFarmaco, updateFarmaco } from './farmacos.controller';

export async function farmacosRoutes(app: FastifyInstance) {
	app.get('/farmacos', getAllFarmacos);

	app.get('/farmacos/:id', getFarmaco);

	app.post('/farmacos', createFarmaco);

	app.put('/farmacos/:id', updateFarmaco);

	app.delete('/farmacos/:id', deleteFarmaco);
}
