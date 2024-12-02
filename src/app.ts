import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import { env } from './env';
import medicosRoutes from './modules/medicos/medicos.routes';
import { ZodError } from 'zod';

export const app = fastify();

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
});

app.register(medicosRoutes);

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({ message: 'Validation error', issues: error.format() });
	}

	return reply.status(500).send({ message: 'Internal server error' });
});
