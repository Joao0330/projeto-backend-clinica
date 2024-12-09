import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import { env } from './env';
import { medicosRoutes } from './modules/medicos/medicos.routes';
import { ZodError } from 'zod';
import { pacientesRoutes } from './modules/pacientes/pacientes.routes';
import { especialidadesRoutes } from './modules/especialidades/especialidades.routes';
import { consultasRoutes } from './modules/consultas/consultas.routes';
import { farmacosRoutes } from './modules/farmacos/farmacos.routes';
import { receitasRoutes } from './modules/receitas/receitas.routes';
import { medicoEspecialidadesRoutes } from './modules/medico-especialidades/medicoEspecialidades.routes';

export const app = fastify();

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
});

app.register(medicosRoutes);
app.register(pacientesRoutes);
app.register(especialidadesRoutes);
app.register(consultasRoutes);
app.register(farmacosRoutes);
app.register(receitasRoutes);
app.register(medicoEspecialidadesRoutes);

app.setErrorHandler((error, request, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({ message: 'Validation error', issues: error.format() });
	}

	console.error('Internal Server Error:', error.message, error.stack);
	console.log('Request Body:', request.body);
	return reply.status(500).send({ message: 'Internal server error' });
});
