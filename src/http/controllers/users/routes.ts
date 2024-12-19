import { FastifyInstance } from 'fastify';
import { registerUser } from './register';
import { loginUser } from './login';


export async function userRoutes(app: FastifyInstance) {
	app.post('/register', registerUser);

	app.post('/login', loginUser);
}
