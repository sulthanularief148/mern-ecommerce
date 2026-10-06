-- AlterTable
ALTER TABLE `orders` ADD COLUMN `pointsEarned` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pointsRedeemed` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `loyaltyPoints` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `referralCode` VARCHAR(20) NULL,
    ADD COLUMN `referredById` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `points_ledger_entries` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `points` INTEGER NOT NULL,
    `reason` VARCHAR(40) NOT NULL,
    `orderId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `points_ledger_entries_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_referralCode_key` ON `users`(`referralCode`);

-- CreateIndex
CREATE INDEX `users_referredById_idx` ON `users`(`referredById`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_referredById_fkey` FOREIGN KEY (`referredById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `points_ledger_entries` ADD CONSTRAINT `points_ledger_entries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

