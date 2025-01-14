import { FastifyInstance } from 'fastify';
import { registerUser } from './register';
import { loginUser } from './login';
import { getCurrentUser } from './getMe';
import { verifyJwt } from '../../middlewares/verify-jwt';

export async function userRoutes(app: FastifyInstance) {
	app.post('/register', registerUser);

	app.post('/login', loginUser);

	app.get('/me', { onRequest: [verifyJwt] }, getCurrentUser);
}
