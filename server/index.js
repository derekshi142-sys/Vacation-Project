const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
// Allow local dev origins like http://localhost:3000, http://127.0.0.1:5501, etc.
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    try {
      const u = new URL(origin);
      const host = u.hostname;
      const port = u.port;
      const allowed = (host === 'localhost' || host === '127.0.0.1');
      return callback(null, allowed);
    } catch (_) {
      return callback(null, false);
    }
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/itinerary', require('./routes/itinerary'));
app.use('/api/maps', require('./routes/maps'));
app.use('/api/pricing', require('./routes/pricing'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/search', require('./routes/search'));

// Handle itinerary generation at the correct endpoint
app.post('/api/generate-itinerary', require('./controllers/itineraryController').generateItinerary);

// Serve static frontend (same-origin)
const publicDir = path.join(__dirname, '..', 'client', 'public');
app.use(express.static(publicDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
