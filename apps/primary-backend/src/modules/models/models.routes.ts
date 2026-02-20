import { Router } from 'express';
import { modelsController } from './models.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// All model routes are read-only and require authentication
router.get('/providers', authMiddleware, modelsController.getProviders.bind(modelsController));
router.get('/', authMiddleware, modelsController.getModels.bind(modelsController));
router.get('/mappings', authMiddleware, modelsController.getModelProviderMappings.bind(modelsController));

export default router;
