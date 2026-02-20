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

    async getBalance(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true },
        });
        return { credits: user?.credits ?? 0 };
    }

    async getTransactions(userId: number) {
        const transactions = await prisma.onrampTransaction.findMany({
            where: { userId },
            orderBy: { id: 'desc' },
            take: 20,
            select: {
                id: true,
                amount: true,
                status: true,
            },
        });
        return { transactions };
    }
}

export const paymentsService = new PaymentsService();
