-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_medicoId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_pacienteId_fkey`;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_medicoId_fkey` FOREIGN KEY (`medicoId`) REFERENCES `medicos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `pacientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
