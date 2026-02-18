import crypto from 'crypto';
import prisma from '../../lib/prisma';
import { CreateApiKeyInput, UpdateApiKeyInput } from './apiKeys.types';

export class ApiKeyService {
    // Generate a secure random API key
    private generateApiKey(): string {
        return `sk-${crypto.randomBytes(32).toString('hex')}`;
    }

    async createApiKey(userId: number, input: CreateApiKeyInput) {
        const apiKey = await prisma.apiKey.create({
            data: {
                userId,
                name: input.name,
                apiKey: this.generateApiKey(),
            },
            select: {
                id: true,
                name: true,
                apiKey: true,
                disabled: true,
                createdAt: true,
            },
        });

        return apiKey;
    }

    async getAllApiKeys(userId: number) {
        const apiKeys = await prisma.apiKey.findMany({
            where: {
                userId,
                deleted: false,
            },
            select: {
                id: true,
                name: true,
                apiKey: true,
                disabled: true,
                lastUsed: true,
                creditsConsumed: true,
                createdAt: true,
            },
            orderBy: { id: 'desc' },
        });

        return apiKeys;
    }

    async updateApiKeyStatus(userId: number, input: UpdateApiKeyInput) {
        // Ensure the key belongs to this user and is not deleted
        const existing = await prisma.apiKey.findFirst({
            where: { id: input.id, userId, deleted: false },
        });

        if (!existing) {
            throw new Error('API key not found');
        }

        const updated = await prisma.apiKey.update({
            where: { id: input.id },
            data: { disabled: input.disabled },
            select: {
                id: true,
                name: true,
                disabled: true,
            },
        });

        return updated;
    }

    async deleteApiKey(userId: number, apiKeyId: number) {
        // Ensure the key belongs to this user and is not already deleted
        const existing = await prisma.apiKey.findFirst({
            where: { id: apiKeyId, userId, deleted: false },
        });

        if (!existing) {
            throw new Error('API key not found');
        }

        // Soft delete
        await prisma.apiKey.update({
            where: { id: apiKeyId },
            data: { deleted: true },
        });
    }
}

export const apiKeyService = new ApiKeyService();
