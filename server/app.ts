import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import ticketRoutes from './routes/tickets';
import userRoutes from './routes/users';
import statsRoutes from './routes/stats';

export const app = express();

app.use(cors());
app.use(express.json());

// API root and health check endpoints (do NOT intercept '/' so SPA can serve React index.html)
app.get(['/api', '/api/', '/api/health', '/health'], (_req, res) => {
  res.json({
    status: 'ok',
    service: 'IT Helpdesk Portal API',
    version: '1.0.0',
    endpoints: {
      auth: ['/api/auth/login', '/api/auth/me', '/api/auth/logout'],
      tickets: ['/api/tickets', '/api/tickets/:id', '/api/tickets/:id/comments'],
      stats: ['/api/stats'],
      users: ['/api/users'],
      health: ['/api/health'],
    },
    timestamp: new Date().toISOString(),
  });
});

// Mount modular API routes - support both /api/* and root paths
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/tickets', '/tickets'], ticketRoutes);
app.use(['/api/users', '/users'], userRoutes);
app.use(['/api/stats', '/stats'], statsRoutes);

// Direct aliases for login and me
app.post(['/api/login', '/login'], (req, res, next) => {
  req.url = '/login';
  authRoutes(req, res, next);
});

app.get(['/api/me', '/me'], (req, res, next) => {
  req.url = '/me';
  authRoutes(req, res, next);
});

// API 404 handler ONLY for /api routes - NEVER intercept non-API / SPA routes
app.use('/api', (req, res) => {
  res.status(404).json({
    error: `API endpoint '${req.originalUrl || req.url}' not found`,
    availableEndpoints: [
      'GET /api',
      'GET /api/health',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'POST /api/auth/logout',
      'GET /api/tickets',
      'POST /api/tickets',
      'GET /api/stats',
      'GET /api/users',
    ],
  });
});

export default app;
