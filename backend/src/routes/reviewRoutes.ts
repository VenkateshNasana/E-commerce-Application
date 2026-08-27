import { Router } from 'express';
import { createReview, deleteReview } from '../controllers/reviewController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticate, createReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
