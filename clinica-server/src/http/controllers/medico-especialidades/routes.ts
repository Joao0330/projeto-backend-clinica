import { FastifyInstance } from 'fastify';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { verifyUserRole } from '../../middlewares/verify-user-role';
import { medicoEspecialidadesParams } from './medico-especialidades.types';
import { searchByMedico } from './search-by-medico';
import { create } from './create';
import { deleteMedicoEspecialidade } from './delete';

export async function medicoEspecialidadesRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt);

	app.get<{ Params: medicoEspecialidadesParams }>('/medicos-especialidades/:id_medico', { onRequest: [verifyUserRole('ADMIN', "UTENTE", "MEDICO")] }, searchByMedico);

	app.post('/medicos-especialidades', { onRequest: [verifyUserRole('ADMIN')] }, create);

	app.delete<{ Params: medicoEspecialidadesParams }>('/medicos-especialidades/:id_medico/:id_especialidade', { onRequest: [verifyUserRole('ADMIN')] }, deleteMedicoEspecialidade);
}
