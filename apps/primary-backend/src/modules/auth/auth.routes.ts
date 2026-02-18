import { Router } from 'express';
import { authController } from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/sign-up', authController.signup.bind(authController));
router.post('/sign-in', authController.signin.bind(authController));

// Protected routes
router.get('/profile', authMiddleware, authController.profile.bind(authController));

export default router;
