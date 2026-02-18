import 'dotenv/config';
import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PRIMARY_BACKEND_PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'primary-backend' });
});

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Primary Backend API' });
});

// Start server
app.listen(Number(PORT), () => {
  console.log(`Primary backend server running on port ${PORT}`);
});
