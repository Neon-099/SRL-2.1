import express from 'express'
import cors  from 'cors'
import dotenv from 'dotenv'
import { PORT } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(cors({
origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backends is running' });
});

//AUTH ROUTES
app.use('/api/v1/auth', authRoutes);

// Sync endpoint (matching your frontend API)
app.post('/sync', (req, res) => {
  const { queue } = req.body;
  console.log('Receive sync queue:', queue);
  
  // Process your sync queue here
  res.json({ 
    success: true, 
    message: 'Sync completed',
    processed: queue?.length || 0 
  });
});

//ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});