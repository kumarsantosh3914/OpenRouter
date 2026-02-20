import { Response } from 'express';
import { paymentsService } from './payments.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export class PaymentsController {
    async onramp(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const result = await paymentsService.onramp(userId);

            res.status(201).json({
                success: true,
                message: `${result.transaction.amount} credits added successfully`,
                transaction: result.transaction,
                credits: result.credits,
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

export const paymentsController = new PaymentsController();
