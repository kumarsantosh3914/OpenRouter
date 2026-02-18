import { z } from 'zod';

export const createApiKeySchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
});

export const updateApiKeySchema = z.object({
    id: z.number().int().positive('ID must be a positive integer'),
    disabled: z.boolean(),
});

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export type UpdateApiKeyInput = z.infer<typeof updateApiKeySchema>;
