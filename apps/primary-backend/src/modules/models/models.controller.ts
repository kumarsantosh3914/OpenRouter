import { Response } from 'express';
import { modelsService } from './models.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export class ModelsController {
    async getProviders(req: AuthRequest, res: Response) {
        try {
            const providers = await modelsService.getAllProviders();
            res.json({ success: true, providers });
        } catch (error: any) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async getModels(req: AuthRequest, res: Response) {
        try {
            const models = await modelsService.getAllModels();
            res.json({ success: true, models });
        } catch (error: any) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async getModelProviderMappings(req: AuthRequest, res: Response) {
        try {
            const rawModelId = req.query.modelId;
            let modelId: number | undefined;

            if (rawModelId !== undefined) {
                modelId = parseInt(String(rawModelId), 10);
                if (isNaN(modelId) || modelId <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'modelId must be a positive integer',
                    });
                }
            }

            const mappings = await modelsService.getModelProviderMappings(modelId);
            res.json({ success: true, mappings });
        } catch (error: any) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

export const modelsController = new ModelsController();
