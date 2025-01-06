-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_medicoId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_pacienteId_fkey`;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_medicoId_fkey` FOREIGN KEY (`medicoId`) REFERENCES `medicos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `pacientes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_email_key` TO `user_email_key`;
