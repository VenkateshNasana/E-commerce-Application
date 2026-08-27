import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding NexusGaming database...');

  // Clean database
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
  const userPasswordHash = await bcrypt.hash('User@123456', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Nexus Admin',
      email: 'admin@nexusgaming.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Cyber Samurai',
      email: 'user@nexusgaming.com',
      passwordHash: userPasswordHash,
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      addresses: {
        create: [
          {
            fullName: 'Cyber Samurai',
            street: '777 Neon Cyber Way',
            city: 'Neo Tokyo',
            state: 'CA',
            postalCode: '90210',
            country: 'United States',
            isDefault: true,
          },
        ],
      },
    },
  });

  console.log('✅ Users created: Admin (admin@nexusgaming.com), Customer (user@nexusgaming.com)');

  // Create Categories
  const categoriesData = [
    {
      name: 'Graphics Cards & Components',
      slug: 'gpu-components',
      description: 'Ultra high-performance graphics cards, liquid coolers, power supplies, and processors.',
      imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800',
    },
    {
      name: 'Gaming Laptops & Rig PCs',
      slug: 'laptops-pcs',
      description: 'Custom forged battle stations and portable high-refresh-rate gaming laptops.',
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
    },
    {
      name: 'Peripherals & Accessories',
      slug: 'peripherals-accessories',
      description: 'RGB mechanical keyboards, high-DPI wireless optical mice, and studio headsets.',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    },
    {
      name: 'Consoles & VR Gear',
      slug: 'consoles-vr',
      description: 'Next-generation consoles, wireless handhelds, and 4K OLED VR headsets.',
      imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
    },
    {
      name: 'Digital Games & Pass',
      slug: 'digital-games',
      description: 'AAA gaming titles, season passes, and digital game codes delivered instantly.',
      imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
    },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({ data: cat });
    categoriesMap[cat.slug] = createdCat.id;
  }

  console.log('✅ Categories created');

  // Create Products
  const productsData = [
    {
      name: 'NVIDIA GeForce RTX 4090 OC 24GB',
      slug: 'nvidia-geforce-rtx-4090-oc-24gb',
      description: 'The ultimate GeForce GPU built with Ada Lovelace architecture, DLSS 3, and 24GB GDDR6X extreme VRAM.',
      price: 1699.99,
      discountPrice: 1599.99,
      stockQuantity: 12,
      sku: 'GPU-RTX4090-24G',
      brand: 'NVIDIA',
      isFeatured: true,
      categoryId: categoriesMap['gpu-components'],
      images: [
        'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
      ],
    },
    {
      name: 'AMD Ryzen 9 7950X3D 16-Core Processor',
      slug: 'amd-ryzen-9-7950x3d',
      description: '16 cores and 32 threads featuring 3D V-Cache technology for record-breaking gaming FPS.',
      price: 699.99,
      discountPrice: 629.99,
      stockQuantity: 25,
      sku: 'CPU-RYZEN9-7950X3D',
      brand: 'AMD',
      isFeatured: true,
      categoryId: categoriesMap['gpu-components'],
      images: [
        'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800',
      ],
    },
    {
      name: 'ROG Strix Scar 18 Gaming Laptop (240Hz OLED)',
      slug: 'rog-strix-scar-18-laptop',
      description: 'Intel Core i9-14900HX, RTX 4090 Laptop GPU, 64GB DDR5, 2TB PCIe Gen4 SSD, 18-inch 240Hz QHD+ display.',
      price: 3499.99,
      discountPrice: 3299.99,
      stockQuantity: 8,
      sku: 'LAP-ROG-SCAR18',
      brand: 'ASUS ROG',
      isFeatured: true,
      categoryId: categoriesMap['laptops-pcs'],
      images: [
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
      ],
    },
    {
      name: 'CyberForge Alpha X Gaming Desktop',
      slug: 'cyberforge-alpha-x-desktop',
      description: 'Custom liquid-cooled gaming PC with i9-14900K, RTX 4080 Super, 32GB RGB DDR5, 2TB NVMe.',
      price: 2499.99,
      discountPrice: 2299.99,
      stockQuantity: 10,
      sku: 'PC-ALPHA-X',
      brand: 'CyberForge',
      isFeatured: true,
      categoryId: categoriesMap['laptops-pcs'],
      images: [
        'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800',
      ],
    },
    {
      name: 'Apex Pro TKL Wireless Mechanical Keyboard',
      slug: 'apex-pro-tkl-wireless-keyboard',
      description: 'OmniPoint 2.0 adjustable hyper-magnetic switches, OLED smart display, aircraft-grade aluminum build.',
      price: 249.99,
      discountPrice: 219.99,
      stockQuantity: 30,
      sku: 'KB-APEX-PRO-TKL',
      brand: 'SteelSeries',
      isFeatured: true,
      categoryId: categoriesMap['peripherals-accessories'],
      images: [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      ],
    },
    {
      name: 'Logitech G Pro X Superlight 2 DEX Wireless Mouse',
      slug: 'logitech-g-pro-x-superlight-2',
      description: '60g ultra-lightweight ergonomic design, HERO 2 sensor with 32,000 DPI and LIGHTSPEED wireless polling.',
      price: 159.99,
      discountPrice: 139.99,
      stockQuantity: 45,
      sku: 'MSE-GPRO-X2',
      brand: 'Logitech G',
      isFeatured: true,
      categoryId: categoriesMap['peripherals-accessories'],
      images: [
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800',
      ],
    },
    {
      name: 'Razer BlackShark V2 Pro Wireless Headset',
      slug: 'razer-blackshark-v2-pro',
      description: 'TriForce Titanium 50mm drivers, HyperClear super-wideband mic, ultra-soft memory foam ear cushions.',
      price: 199.99,
      discountPrice: 179.99,
      stockQuantity: 20,
      sku: 'HSET-RAZER-BSV2P',
      brand: 'Razer',
      isFeatured: false,
      categoryId: categoriesMap['peripherals-accessories'],
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      ],
    },
    {
      name: 'PlayStation 5 Pro Console Digital Edition',
      slug: 'playstation-5-pro-console',
      description: '2TB SSD, PlayStation Spectral Super Resolution (PSSR), advanced ray tracing, DualSense wireless controller.',
      price: 699.99,
      discountPrice: 679.99,
      stockQuantity: 15,
      sku: 'CON-PS5-PRO',
      brand: 'Sony',
      isFeatured: true,
      categoryId: categoriesMap['consoles-vr'],
      images: [
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
      ],
    },
    {
      name: 'Meta Quest 3S 128GB All-In-One VR Headset',
      slug: 'meta-quest-3s-128gb',
      description: 'High-definition full-color Passthrough mixed reality, Snapdragon XR2 Gen 2 performance, Touch Plus controllers.',
      price: 299.99,
      discountPrice: null,
      stockQuantity: 18,
      sku: 'VR-QUEST-3S',
      brand: 'Meta',
      isFeatured: false,
      categoryId: categoriesMap['consoles-vr'],
      images: [
        'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800',
      ],
    },
    {
      name: 'Cyberpunk 2077: Phantom Liberty Expansion Pass',
      slug: 'cyberpunk-2077-phantom-liberty',
      description: 'Spy-thriller adventure for Cyberpunk 2077 set in Dogtown. Includes Digital PC Code.',
      price: 29.99,
      discountPrice: 24.99,
      stockQuantity: 500,
      sku: 'GAME-CP2077-PL',
      brand: 'CD PROJEKT RED',
      isFeatured: true,
      categoryId: categoriesMap['digital-games'],
      images: [
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      ],
    },
  ];

  for (const prodData of productsData) {
    const { images, ...productInfo } = prodData;
    const createdProduct = await prisma.product.create({
      data: {
        ...productInfo,
        images: {
          create: images.map((url, idx) => ({
            url,
            isPrimary: idx === 0,
          })),
        },
      },
    });

    // Seed Sample Review
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: customer.id,
        rating: 5,
        title: 'Unbelievable Gaming Performance!',
        comment: 'Order arrived fast, packaging was pristine and FPS went through the roof. 10/10 NexusGaming!',
      },
    });
  }

  console.log('✅ Products & Reviews seeded');

  // Seed Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'GAMER10',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minPurchase: 50.0,
      },
      {
        code: 'NEXUS25',
        discountType: 'FIXED',
        discountValue: 25,
        minPurchase: 100.0,
      },
    ],
  });

  console.log('✅ Coupons seeded: GAMER10, NEXUS25');
  console.log('🎉 NexusGaming Database Seeding Completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
