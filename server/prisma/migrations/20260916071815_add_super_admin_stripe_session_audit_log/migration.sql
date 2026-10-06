-- AlterTable
ALTER TABLE `orders` ADD COLUMN `stripeSessionId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('CUSTOMER', 'ADMIN', 'SUPER_ADMIN') NOT NULL DEFAULT 'CUSTOMER';

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `actorId` VARCHAR(191) NOT NULL,
    `actorEmail` VARCHAR(190) NOT NULL,
    `action` VARCHAR(80) NOT NULL,
    `targetType` VARCHAR(60) NOT NULL,
    `targetId` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_actorId_idx`(`actorId`),
    INDEX `audit_logs_targetType_targetId_idx`(`targetType`, `targetId`),
    INDEX `audit_logs_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
