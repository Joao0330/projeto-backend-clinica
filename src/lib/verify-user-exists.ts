import { prisma } from './prisma';

export async function verifyUserExists(email: string): Promise<boolean> {
	const existingUser = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	return existingUser !== null;
}
