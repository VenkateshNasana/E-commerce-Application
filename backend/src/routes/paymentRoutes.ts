import { Router } from 'express';
import { createPaymentIntent, verifyPaymentStatus } from '../controllers/paymentController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);
router.post('/create-intent', createPaymentIntent);
router.post('/verify', verifyPaymentStatus);

export default router;
