import { prisma } from "./prisma";

export async function verifyPacienteExists(id_paciente: string): Promise<boolean> {
    const paciente = await prisma.pacientes.findUnique({
        where: {
            id: id_paciente,
        },
    });

    return paciente !== null;
}