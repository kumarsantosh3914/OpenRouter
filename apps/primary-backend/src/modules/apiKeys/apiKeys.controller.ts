import { Response } from 'express';
import { apiKeyService } from './apiKeys.service';
import { createApiKeySchema, updateApiKeySchema } from './apiKeys.types';
import { AuthRequest } from '../../middleware/auth.middleware';


export class ApiKeyController {
    async create(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const input = createApiKeySchema.parse(req.body);
            const apiKey = await apiKeyService.createApiKey(userId, input);

            res.status(201).json({ success: true, message: 'API key created successfully', apiKey });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
            }
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async getAll(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const apiKeys = await apiKeyService.getAllApiKeys(userId);

            res.json({ success: true, apiKeys });
        } catch (error: any) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async updateStatus(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const input = updateApiKeySchema.parse(req.body);
            const apiKey = await apiKeyService.updateApiKeyStatus(userId, input);

            res.json({ success: true, message: 'API key updated successfully', apiKey });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
            }
            if (error.message === 'API key not found') {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async delete(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const apiKeyId = parseInt(String(req.params.id), 10);
            if (isNaN(apiKeyId)) {
                return res.status(400).json({ success: false, message: 'Invalid API key ID' });
            }

            await apiKeyService.deleteApiKey(userId, apiKeyId);

            res.json({ success: true, message: 'API key deleted successfully' });
        } catch (error: any) {
            if (error.message === 'API key not found') {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

export const apiKeyController = new ApiKeyController();
