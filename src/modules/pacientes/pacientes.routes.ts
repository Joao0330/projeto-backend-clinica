import { FastifyInstance } from 'fastify';
import { createPaciente, deletePaciente, getAllPacientes, getPacienteById, updatePaciente } from './pacientes.controller';

export async function pacientesRoutes(app: FastifyInstance) {
	app.get('/pacientes', getAllPacientes);

	app.get('/pacientes/:id', getPacienteById);

	app.post('/pacientes', createPaciente);

	app.put('/pacientes/:id', updatePaciente);

	app.delete('/pacientes/:id', deletePaciente);
}
