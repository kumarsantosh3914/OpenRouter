-- CreateTable
CREATE TABLE `ModelProviderMapping` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modelId` INTEGER NOT NULL,
    `providerId` INTEGER NOT NULL,
    `inputTokenCost` INTEGER NOT NULL,
    `outputTokenCost` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ModelProviderMapping` ADD CONSTRAINT `ModelProviderMapping_modelId_fkey` FOREIGN KEY (`modelId`) REFERENCES `Model`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModelProviderMapping` ADD CONSTRAINT `ModelProviderMapping_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `Provider`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
