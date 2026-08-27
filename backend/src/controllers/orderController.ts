import { Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import { AppError } from '../middleware/errorMiddleware';

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { shippingAddress, paymentMethod = 'CREDIT_CARD', couponCode } = req.body;

    if (!shippingAddress) {
      throw new AppError('Shipping address is required', 400);
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // Validate inventory & recalculate prices on backend
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of cart.items) {
      if (item.product.stockQuantity < item.quantity) {
        throw new AppError(
          `Product "${item.product.name}" is out of stock or insufficient quantity (available: ${item.product.stockQuantity})`,
          400
        );
      }

      const itemPrice = item.product.discountPrice || item.product.price;
      subtotal += itemPrice * item.quantity;

      orderItemsData.push({
        productId: item.product.id,
        price: itemPrice,
        quantity: item.quantity,
      });
    }

    // Coupon discount logic
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive && subtotal >= coupon.minPurchase) {
        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * coupon.discountValue) / 100;
        } else {
          discountAmount = coupon.discountValue;
        }
      }
    }

    const taxAmount = Math.round((subtotal - discountAmount) * 0.08 * 100) / 100; // 8% tax
    const shippingFee = subtotal > 150 ? 0 : 15.0; // Free shipping over $150
    const totalAmount = Math.max(0, subtotal - discountAmount + taxAmount + shippingFee);

    const orderNumber = `NG-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Order with Transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          subtotal,
          taxAmount,
          shippingFee,
          discountAmount,
          totalAmount,
          couponCode: couponCode || null,
          shippingAddress: typeof shippingAddress === 'object' ? JSON.stringify(shippingAddress) : shippingAddress,
          paymentMethod,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      // 2. Create Payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          paymentMethod,
          transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          amount: totalAmount,
          status: 'COMPLETED',
        },
      });

      // 3. Decrement Stock Quantities
      for (const item of cart.items) {
        const updatedStock = item.product.stockQuantity - item.quantity;
        await tx.product.update({
          where: { id: item.product.id },
          data: {
            stockQuantity: updatedStock,
            inStock: updatedStock > 0,
          },
        });
      }

      // 4. Clear Cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { select: { url: true, isPrimary: true } } },
            },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: { images: true, category: true },
            },
          },
        },
        user: { select: { id: true, name: true, email: true } },
        payments: true,
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.userId !== userId && userRole !== 'ADMIN') {
      throw new AppError('Unauthorized access to this order', 403);
    }

    return res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const getAllOrdersAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: { product: { select: { name: true, price: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
    });

    return res.json({ success: true, message: 'Order status updated', order: updated });
  } catch (error) {
    next(error);
  }
};
