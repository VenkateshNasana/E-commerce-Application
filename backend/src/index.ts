import express from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler } from './middleware/errorMiddleware';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import cartRoutes from './routes/cartRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import reviewRoutes from './routes/reviewRoutes';
import adminRoutes from './routes/adminRoutes';

export const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NexusGaming E-Commerce API',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
const prefix = config.apiPrefix;
app.use(`${prefix}/auth`, authRoutes);
app.use(`${prefix}/products`, productRoutes);
app.use(`${prefix}/categories`, categoryRoutes);
app.use(`${prefix}/cart`, cartRoutes);
app.use(`${prefix}/wishlist`, wishlistRoutes);
app.use(`${prefix}/orders`, orderRoutes);
app.use(`${prefix}/payments`, paymentRoutes);
app.use(`${prefix}/reviews`, reviewRoutes);
app.use(`${prefix}/admin`, adminRoutes);

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`🚀 NexusGaming Backend API running on http://localhost:${config.port}${prefix}`);
  });
}

export default app;
