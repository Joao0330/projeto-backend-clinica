import { hash } from 'bcrypt';
import { env } from '../src/env/index';
import { prisma } from '../src/lib/prisma';

async function createAdmin() {
	const adminEmail = env.ADMIN_EMAIL;
	const adminPassword = env.ADMIN_PASSWORD;

	const hashedPassword = await hash(adminPassword, 6);

	const existingAdmin = await prisma.user.findUnique({
		where: {
			email: adminEmail,
		},
	});

	if (!existingAdmin) {
		await prisma.user.create({
			data: {
				nome: 'Admin',
				email: adminEmail,
				password: hashedPassword,
				role: 'ADMIN',
			},
		});
		console.log(`Usuário ADMIN criado com email: ${adminEmail}`);
	} else {
		console.log('Usuário ADMIN já existente.');
	}
}

async function main() {
	try {
		await createAdmin();
	} catch (err) {
		console.error('Erro ao executar o seed:', err);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

main();
