import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorMiddleware';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      isFeatured,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = '1',
      limit = '12',
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { description: { contains: search as string } },
        { brand: { contains: search as string } },
      ];
    }

    if (category) {
      where.category = {
        slug: category as string,
      };
    }

    if (brand) {
      where.brand = brand as string;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (rating) {
      where.rating = { gte: parseFloat(rating as string) };
    }

    if (inStock === 'true') {
      where.stockQuantity = { gt: 0 };
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (sortBy === 'rating') orderBy = { rating: 'desc' };
    if (sortBy === 'name') orderBy = { name: 'asc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { select: { id: true, url: true, isPrimary: true } },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Related products in same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: {
        category: { select: { name: true, slug: true } },
        images: { select: { url: true, isPrimary: true } },
      },
      take: 4,
    });

    return res.json({ success: true, product, relatedProducts });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      discountPrice,
      stockQuantity,
      sku,
      brand,
      categoryId,
      isFeatured,
      images,
    } = req.body;

    if (!name || !price || !categoryId || !sku) {
      throw new AppError('Name, price, SKU, and categoryId are required', 400);
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = await prisma.product.create({
      data: {
        name,
        slug: generatedSlug,
        description: description || '',
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stockQuantity: parseInt(stockQuantity || '0', 10),
        sku,
        brand: brand || 'Nexus',
        isFeatured: isFeatured || false,
        inStock: parseInt(stockQuantity || '0', 10) > 0,
        categoryId,
        images: {
          create: images && images.length > 0
            ? images.map((img: { url: string; isPrimary?: boolean }) => ({
                url: img.url,
                isPrimary: img.isPrimary || false,
              }))
            : [{ url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600', isPrimary: true }],
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    return res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, price, discountPrice, stockQuantity, brand, categoryId, isFeatured } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Product not found', 404);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(discountPrice !== undefined && { discountPrice: discountPrice ? parseFloat(discountPrice) : null }),
        ...(stockQuantity !== undefined && {
          stockQuantity: parseInt(stockQuantity, 10),
          inStock: parseInt(stockQuantity, 10) > 0,
        }),
        ...(brand && { brand }),
        ...(categoryId && { categoryId }),
        ...(isFeatured !== undefined && { isFeatured }),
      },
      include: {
        category: true,
        images: true,
      },
    });

    return res.json({ success: true, message: 'Product updated successfully', product: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
