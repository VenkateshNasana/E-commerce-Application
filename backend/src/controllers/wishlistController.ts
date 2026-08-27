import { Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import { AppError } from '../middleware/errorMiddleware';

export const getWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const items = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: { select: { name: true } },
            images: { select: { url: true, isPrimary: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, wishlist: items });
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { productId } = req.body;

    if (!productId) {
      throw new AppError('Product ID is required', 400);
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return res.json({ success: true, action: 'removed', message: 'Item removed from wishlist' });
    } else {
      await prisma.wishlist.create({
        data: {
          userId,
          productId,
        },
      });
      return res.json({ success: true, action: 'added', message: 'Item added to wishlist' });
    }
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { productId } = req.params;

    await prisma.wishlist.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    return res.json({ success: true, message: 'Item removed from wishlist' });
  } catch (error) {
    next(error);
  }
};
