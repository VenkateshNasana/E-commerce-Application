import { Router } from 'express';
import { getDashboardStats, getAllUsers, updateUserRole } from '../controllers/adminController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate, authorizeAdmin);
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

export default router;
