import { FastifyInstance } from 'fastify';
import { createMedicoEspecialidade, deleteMedicoEspecialidade, getEspecialidadesByMedico, medicoEspecialidadesParams } from './medicoEspecialidades.controller';
import { verifyJwt } from '../../http/middlewares/verify-jwt';
import { verifyUserRole } from '../../http/middlewares/verify-user-role';

export async function medicoEspecialidadesRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt);

	app.get<{ Params: medicoEspecialidadesParams }>('/medicos-especialidades/:id_medico', { onRequest: [verifyUserRole('ADMIN')] }, getEspecialidadesByMedico);

	app.post('/medicos-especialidades', { onRequest: [verifyUserRole('ADMIN')] }, createMedicoEspecialidade);

	app.delete<{ Params: medicoEspecialidadesParams }>('/medicos-especialidades/:id_medico/:id_especialidade', { onRequest: [verifyUserRole('ADMIN')] }, deleteMedicoEspecialidade);
}
