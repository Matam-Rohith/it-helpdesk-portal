import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import ticketRoutes from './routes/tickets';
import userRoutes from './routes/users';
import statsRoutes from './routes/stats';

export const app = express();

app.use(cors());
app.use(express.json());

// API health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'IT Helpdesk API', timestamp: new Date().toISOString() });
});

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

// Generic API 404 handler
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

export default app;
