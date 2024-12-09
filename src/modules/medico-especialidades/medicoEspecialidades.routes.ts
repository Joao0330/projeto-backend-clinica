import { FastifyInstance } from 'fastify';
import { createMedicoEspecialidade, deleteMedicoEspecialidade, getEspecialidadesByMedico } from './medicoEspecialidades.controller';

export async function medicoEspecialidadesRoutes(app: FastifyInstance) {
	app.get('/medicos-especialidades/:id_medico', getEspecialidadesByMedico);

	app.post('/medicos-especialidades', createMedicoEspecialidade);

	app.delete('/medicos-especialidades/:id_medico/:id_especialidade', deleteMedicoEspecialidade);
}
