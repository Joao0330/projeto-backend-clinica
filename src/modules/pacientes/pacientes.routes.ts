import { FastifyInstance } from 'fastify';
import { createPaciente, deletePaciente, getAllPacientes, getPacienteInfo, pacientesParams, updatePaciente } from './pacientes.controller';
import { verifyJwt } from '../../http/middlewares/verify-jwt';
import { verifyUserRole } from '../../http/middlewares/verify-user-role';

export async function pacientesRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJwt);

	app.get('/pacientes', { onRequest: [verifyUserRole('ADMIN')] }, getAllPacientes);

	app.get<{ Params: pacientesParams }>('/pacientes/:id', { onRequest: [verifyUserRole('MEDICO')] }, getPacienteInfo);

	app.post('/pacientes', { onRequest: [verifyUserRole('ADMIN')] }, createPaciente);

	app.put<{ Params: pacientesParams }>('/pacientes/:id', { onRequest: [verifyUserRole('ADMIN')] }, updatePaciente);

	app.delete<{ Params: pacientesParams }>('/pacientes/:id', { onRequest: [verifyUserRole('ADMIN')] }, deletePaciente);
}
