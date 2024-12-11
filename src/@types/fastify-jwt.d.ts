import '@fastify/jwt';

declare module '@fastify/jwt' {
	export interface FastifyJWT {
		user: {
			role: 'ADMIN' | 'MEDICO' | 'UTENTE';
			sub: string;
		};
	}
}
