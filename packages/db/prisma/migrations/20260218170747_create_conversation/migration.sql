-- CreateTable
CREATE TABLE `Conversation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `apiKeyId` INTEGER NOT NULL,
    `modelProviderMappingId` INTEGER NOT NULL,
    `input` VARCHAR(191) NOT NULL,
    `output` VARCHAR(191) NOT NULL,
    `inputTokenCount` INTEGER NOT NULL,
    `outputTokenCount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_apiKeyId_fkey` FOREIGN KEY (`apiKeyId`) REFERENCES `ApiKey`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_modelProviderMappingId_fkey` FOREIGN KEY (`modelProviderMappingId`) REFERENCES `ModelProviderMapping`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
