import { prisma } from "./prisma";

export async function verifyFarmacoExists(id_farmaco: string): Promise<boolean> {
	const farmaco = await prisma.farmacos.findUnique({
		where: {
			id: id_farmaco,
		},
	});

    return farmaco !== null;
}
