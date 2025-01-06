import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	JWT_SECRET: z.string(),
	ADMIN_EMAIL: z.string().email(),
	ADMIN_PASSWORD: z.string().min(6),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
	console.error('Variaveis de ambiente invalidas.', _env.error.format());
	throw new Error('Variaveis de ambiente invalidas.');
}

export const env = _env.data;
