import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DevLog API is running' });
});

// Error handler — must be last
app.use(errorHandler);

export default app;
