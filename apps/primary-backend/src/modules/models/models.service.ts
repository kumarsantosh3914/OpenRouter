import prisma from '../../lib/prisma';

export class ModelsService {
    async getAllProviders() {
        const providers = await prisma.provider.findMany({
            select: {
                id: true,
                name: true,
                website: true,
            },
            orderBy: { id: 'asc' },
        });
        return providers;
    }

    async getAllModels() {
        const models = await prisma.model.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                company: {
                    select: {
                        id: true,
                        name: true,
                        website: true,
                    },
                },
            },
            orderBy: { id: 'asc' },
        });
        return models;
    }

    async getModelProviderMappings(modelId?: number) {
        const mappings = await prisma.modelProviderMapping.findMany({
            where: modelId ? { modelId } : undefined,
            select: {
                id: true,
                inputTokenCost: true,
                outputTokenCost: true,
                model: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        name: true,
                        website: true,
                    },
                },
            },
            orderBy: { id: 'asc' },
        });
        return mappings;
    }
}

export const modelsService = new ModelsService();
