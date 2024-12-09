import { prisma } from "./prisma";

export async function verifyMedicoExists(id_medico: string): Promise<boolean> {
    const medico = await prisma.medicos.findUnique({
        where: {
            id: id_medico,
        },
    });

    return medico !== null;
}