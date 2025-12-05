import express from 'express'
import cors  from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5500

app.use(cors({
origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backends is running' });
});

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});