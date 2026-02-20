import prisma from '../../lib/prisma';
import { ONRAMP_CREDIT_AMOUNT } from './payments.types';

export class PaymentsService {
    async onramp(userId: number) {
        // Run inside a transaction: create record + increment credits atomically
        const [transaction, user] = await prisma.$transaction([
            prisma.onrampTransaction.create({
                data: {
                    userId,
                    amount: ONRAMP_CREDIT_AMOUNT,
                    status: 'success',
                },
                select: {
                    id: true,
                    amount: true,
                    status: true,
                },
            }),
            prisma.user.update({
                where: { id: userId },
                data: {
                    credits: {
                        increment: ONRAMP_CREDIT_AMOUNT,
                    },
                },
                select: {
                    credits: true,
                },
            }),
        ]);

        return {
            transaction,
            credits: user.credits,
        };
    }
}

export const paymentsService = new PaymentsService();
