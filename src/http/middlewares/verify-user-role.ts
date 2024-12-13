import { FastifyReply, FastifyRequest } from 'fastify';

export function verifyUserRole(...rolesToVerify: ('ADMIN' | 'MEDICO' | 'UTENTE')[]) {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		console.log(request.user);
		const { role } = request.user;

		if (!rolesToVerify.includes(role)) {
			return reply.status(401).send({ message: 'Sem permissão' });
		}
	};
}
