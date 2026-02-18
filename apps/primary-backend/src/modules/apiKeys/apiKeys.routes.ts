import { Router } from 'express';
import { apiKeyController } from './apiKeys.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// All API key routes require authentication
router.post('/', authMiddleware, apiKeyController.create.bind(apiKeyController));
router.get('/', authMiddleware, apiKeyController.getAll.bind(apiKeyController));
router.put('/', authMiddleware, apiKeyController.updateStatus.bind(apiKeyController));
router.delete('/:id', authMiddleware, apiKeyController.delete.bind(apiKeyController));

export default router;
