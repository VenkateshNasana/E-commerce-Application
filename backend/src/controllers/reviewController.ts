import { Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import { AppError } from '../middleware/errorMiddleware';

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !title || !comment) {
      throw new AppError('Product ID, rating, title, and comment are required', 400);
    }

    if (rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating: parseInt(rating, 10),
        title,
        comment,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Update product rating and review count
    const reviews = await prisma.review.findMany({ where: { productId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      },
    });

    return res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const { id } = req.params;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.userId !== userId && userRole !== 'ADMIN') {
      throw new AppError('Unauthorized to delete this review', 403);
    }

    await prisma.review.delete({ where: { id } });

    // Recalculate average rating
    const reviews = await prisma.review.findMany({ where: { productId: review.productId } });
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 5.0;

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      },
    });

    return res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};
