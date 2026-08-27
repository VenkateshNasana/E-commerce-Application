import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById, getAllOrdersAdmin, updateOrderStatusAdmin } from '../controllers/orderController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/admin/all', authorizeAdmin, getAllOrdersAdmin);
router.put('/admin/:id/status', authorizeAdmin, updateOrderStatusAdmin);
router.get('/:id', getOrderById);

export default router;
