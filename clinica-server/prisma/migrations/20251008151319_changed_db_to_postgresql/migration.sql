-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEDICO', 'UTENTE');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "contacto" TEXT,
    "morada" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'UTENTE',
    "medicoId" TEXT,
    "pacienteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "especialidades" (
    "id" TEXT NOT NULL,
    "designacao" TEXT,

    CONSTRAINT "especialidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicos" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "contacto" TEXT,
    "morada" TEXT,
    "numero_empregado" INTEGER NOT NULL,

    CONSTRAINT "medicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "contacto" TEXT,
    "morada" TEXT,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultas" (
    "id_medico" TEXT NOT NULL,
    "id_consulta" TEXT NOT NULL,
    "id_especialidade" TEXT NOT NULL,
    "id_paciente" TEXT NOT NULL,
    "numero_consulta" INTEGER NOT NULL,
    "data_inicio" TIMESTAMP(3),
    "data_fim" TIMESTAMP(3),

    CONSTRAINT "consultas_pkey" PRIMARY KEY ("id_medico","id_consulta")
);

-- CreateTable
CREATE TABLE "receita" (
    "id_consulta_medico" TEXT NOT NULL,
    "id_consulta" TEXT NOT NULL,
    "id_farmaco" TEXT NOT NULL,
    "data_receita" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receita_pkey" PRIMARY KEY ("id_consulta_medico","id_consulta","id_farmaco")
);

-- CreateTable
CREATE TABLE "farmacos" (
    "id" TEXT NOT NULL,
    "nome" TEXT,

    CONSTRAINT "farmacos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medico_especialidades" (
    "id_medico" TEXT NOT NULL,
    "id_especialidade" TEXT NOT NULL,

    CONSTRAINT "medico_especialidades_pkey" PRIMARY KEY ("id_medico","id_especialidade")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "medicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_id_medico_fkey" FOREIGN KEY ("id_medico") REFERENCES "medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_id_especialidade_fkey" FOREIGN KEY ("id_especialidade") REFERENCES "especialidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receita" ADD CONSTRAINT "receita_id_consulta_medico_id_consulta_fkey" FOREIGN KEY ("id_consulta_medico", "id_consulta") REFERENCES "consultas"("id_medico", "id_consulta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receita" ADD CONSTRAINT "receita_id_farmaco_fkey" FOREIGN KEY ("id_farmaco") REFERENCES "farmacos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medico_especialidades" ADD CONSTRAINT "medico_especialidades_id_medico_fkey" FOREIGN KEY ("id_medico") REFERENCES "medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medico_especialidades" ADD CONSTRAINT "medico_especialidades_id_especialidade_fkey" FOREIGN KEY ("id_especialidade") REFERENCES "especialidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
