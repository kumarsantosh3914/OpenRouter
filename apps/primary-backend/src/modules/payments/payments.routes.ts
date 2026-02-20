import { Router } from 'express';
import { paymentsController } from './payments.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// POST /api/v1/payments/onramp — add 1000 credits to the authenticated user
router.post('/onramp', authMiddleware, paymentsController.onramp.bind(paymentsController));

export default router;
