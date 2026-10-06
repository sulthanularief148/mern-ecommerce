-- AlterTable
ALTER TABLE `products` ADD COLUMN `sku` VARCHAR(40) NULL,
    ADD COLUMN `fabric` VARCHAR(80) NULL,
    ADD COLUMN `fabricComposition` VARCHAR(160) NULL,
    ADD COLUMN `pattern` VARCHAR(60) NULL,
    ADD COLUMN `color` VARCHAR(40) NULL,
    ADD COLUMN `occasion` VARCHAR(60) NULL,
    ADD COLUMN `collectionName` VARCHAR(80) NULL,
    ADD COLUMN `gsm` INTEGER NULL,
    ADD COLUMN `dimensions` VARCHAR(120) NULL,
    ADD COLUMN `careInstructions` TEXT NULL,
    ADD COLUMN `sizeChart` JSON NULL,
    ADD COLUMN `videoUrl` VARCHAR(500) NULL;

CREATE UNIQUE INDEX `products_sku_key` ON `products`(`sku`);
CREATE INDEX `products_fabric_idx` ON `products`(`fabric`);
CREATE INDEX `products_color_idx` ON `products`(`color`);
CREATE INDEX `products_collectionName_idx` ON `products`(`collectionName`);

-- CreateTable
CREATE TABLE `coupons` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(40) NOT NULL,
    `type` ENUM('PERCENT', 'FLAT') NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL,
    `minOrderAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `maxDiscount` DECIMAL(10, 2) NULL,
    `usageLimit` INTEGER NULL,
    `timesUsed` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `coupons_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable: add order money-breakdown columns as nullable/defaulted first
ALTER TABLE `orders` ADD COLUMN `subtotal` DECIMAL(10, 2) NULL,
    ADD COLUMN `discountAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `taxAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `shippingFee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `couponCode` VARCHAR(40) NULL,
    ADD COLUMN `deliveryMethod` VARCHAR(20) NOT NULL DEFAULT 'STANDARD';

-- Backfill existing rows: prior to this migration `amount` was the full
-- total with no separate tax/discount, so treat it as the subtotal.
UPDATE `orders` SET `subtotal` = `amount` WHERE `subtotal` IS NULL;

-- Now that every row has a value, enforce NOT NULL to match the Prisma schema.
ALTER TABLE `orders` MODIFY COLUMN `subtotal` DECIMAL(10, 2) NOT NULL;
