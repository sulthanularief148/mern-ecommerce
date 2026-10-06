-- AlterTable
ALTER TABLE `orders` ADD COLUMN `carrier` VARCHAR(60) NULL,
    ADD COLUMN `trackingNumber` VARCHAR(80) NULL,
    ADD COLUMN `trackingUrl` VARCHAR(500) NULL;
