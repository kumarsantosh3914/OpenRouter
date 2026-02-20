import { Router } from 'express';
import { paymentsController } from './payments.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// POST /api/v1/payments/onramp — add 1000 credits to the authenticated user
router.post('/onramp', authMiddleware, paymentsController.onramp.bind(paymentsController));

// GET /api/v1/payments/balance — get current credit balance
router.get('/balance', authMiddleware, paymentsController.getBalance.bind(paymentsController));

// GET /api/v1/payments/transactions — get top-20 credit transactions
router.get('/transactions', authMiddleware, paymentsController.getTransactions.bind(paymentsController));

export default router;
