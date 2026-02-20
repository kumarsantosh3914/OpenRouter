import { Request, Response } from 'express';
import { authService } from './auth.service';
import { signupSchema, signinSchema } from './auth.types';

export class AuthController {
  async signup(req: Request, res: Response) {
    try {
      // Validate input
      const validatedInput = signupSchema.parse(req.body);

      // Create user
      const result = await authService.signup(validatedInput);

      // Set JWT token in http-only cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: result.user,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }

      if (error.message === 'User with this email already exists') {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async signin(req: Request, res: Response) {
    try {
      // Validate input
      const validatedInput = signinSchema.parse(req.body);

      // Authenticate user
      const result = await authService.signin(validatedInput);

      // Set JWT token in http-only cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        success: true,
        message: 'Signed in successfully',
        user: result.user,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }

      if (
        error.message === 'Invalid email or password' ||
        error.message === 'User not found'
      ) {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async profile(req: Request, res: Response) {
    try {
      // User is attached to req by authMiddleware
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const user = await authService.getProfile(userId);

      res.json({
        success: true,
        user,
      });
    } catch (error: any) {
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
  async signOut(req: Request, res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.json({ success: true, message: 'Signed out successfully' });
  }
}

export const authController = new AuthController();
