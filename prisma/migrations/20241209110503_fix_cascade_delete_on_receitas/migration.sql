-- CreateTable
CREATE TABLE `especialidades` (
    `id` VARCHAR(191) NOT NULL,
    `designacao` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medicos` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NULL,
    `contacto` VARCHAR(191) NULL,
    `morada` VARCHAR(191) NULL,
    `numero_ordem` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pacientes` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NULL,
    `contacto` VARCHAR(191) NULL,
    `morada` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consultas` (
    `id_medico` VARCHAR(191) NOT NULL,
    `id_consulta` VARCHAR(191) NOT NULL,
    `id_especialidade` VARCHAR(191) NOT NULL,
    `id_paciente` VARCHAR(191) NOT NULL,
    `numero_consulta` INTEGER NOT NULL,
    `data_inicio` DATETIME(3) NULL,
    `data_fim` DATETIME(3) NULL,

    PRIMARY KEY (`id_medico`, `id_consulta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receita` (
    `id_consulta_medico` VARCHAR(191) NOT NULL,
    `id_consulta` VARCHAR(191) NOT NULL,
    `id_farmaco` VARCHAR(191) NOT NULL,
    `data_receita` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_consulta_medico`, `id_consulta`, `id_farmaco`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `farmacos` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medico_especialidades` (
    `id_medico` VARCHAR(191) NOT NULL,
    `id_especialidade` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_medico`, `id_especialidade`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `consultas` ADD CONSTRAINT `consultas_id_medico_fkey` FOREIGN KEY (`id_medico`) REFERENCES `medicos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consultas` ADD CONSTRAINT `consultas_id_paciente_fkey` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consultas` ADD CONSTRAINT `consultas_id_especialidade_fkey` FOREIGN KEY (`id_especialidade`) REFERENCES `especialidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receita` ADD CONSTRAINT `receita_id_consulta_medico_id_consulta_fkey` FOREIGN KEY (`id_consulta_medico`, `id_consulta`) REFERENCES `consultas`(`id_medico`, `id_consulta`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receita` ADD CONSTRAINT `receita_id_farmaco_fkey` FOREIGN KEY (`id_farmaco`) REFERENCES `farmacos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medico_especialidades` ADD CONSTRAINT `medico_especialidades_id_medico_fkey` FOREIGN KEY (`id_medico`) REFERENCES `medicos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medico_especialidades` ADD CONSTRAINT `medico_especialidades_id_especialidade_fkey` FOREIGN KEY (`id_especialidade`) REFERENCES `especialidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
