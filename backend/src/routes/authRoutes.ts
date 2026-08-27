import { Router } from 'express';
import { register, login, getMe, updateProfile, addAddress, getAddresses } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.post('/addresses', authenticate, addAddress);
router.get('/addresses', authenticate, getAddresses);

export default router;
