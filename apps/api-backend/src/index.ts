import 'dotenv/config';
import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.API_BACKEND_PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'api-backend' });
});

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'API Backend' });
});

// Start server
app.listen(Number(PORT), () => {
  console.log(`API backend server running on port ${PORT}`);
});
