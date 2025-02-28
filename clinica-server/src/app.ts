import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import { env } from './env';
import { medicosRoutes } from './http/controllers/medicos/routes';
import { ZodError } from 'zod';
import { pacientesRoutes } from './http/controllers/pacientes/routes';
import { especialidadesRoutes } from './http/controllers/especialidades/routes';
import { consultasRoutes } from './http/controllers/consultas/routes';
import { farmacosRoutes } from './http/controllers/farmacos/routes';
import { receitasRoutes } from './http/controllers/receitas/routes';
import { medicoEspecialidadesRoutes } from './http/controllers/medico-especialidades/routes';
import { userRoutes } from './http/controllers/users/routes';
import fastifyCors from '@fastify/cors';

export const app = fastify();

app.register(fastifyCors, {});

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
app.register(userRoutes);

app.setErrorHandler((error, request, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({ message: 'Validation error', issues: error.format() });
	}

	console.error('Internal Server Error:', error.message, error.stack);
	console.log('Request Body:', request.body);
	return reply.status(500).send({ message: 'Internal server error' });
});
