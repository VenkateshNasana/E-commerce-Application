# E-commerce-Application
# NexusGaming - Full-Stack Gaming E-Commerce Platform

> **A production-grade, full-stack gaming e-commerce application** built with React, Node.js/Express, Prisma ORM, and SQLite. Features a dark cyberpunk UI, JWT authentication, cart/wishlist/checkout workflows, admin dashboard, Stripe-compatible payment architecture, reviews, and comprehensive automated test suites.

---

## 🎮 Live Features

### Customer Experience
- 🏠 **Home Page** – Hero carousel, category grid, featured products, search, filters
- 🔍 **Product Catalog** – Real-time search, category/brand/price/stock filters, sort, pagination
- 🛒 **Product Details** – Image gallery, quantity selector, reviews, ratings, Add to Cart / Buy Now
- 🧺 **Shopping Cart** – Drawer UI, coupon codes (GAMER10, NEXUS25), tax & shipping calculation
- ❤️ **Wishlist** – Toggle wishlist, persist across sessions
- 📦 **Checkout** – Multi-step: Address → Payment → Confirmation. Backend recalculates prices
- 📋 **Orders** – Full order history with status, breakdown, shipping address
- 👤 **Profile** – View and update profile details, manage addresses

### Admin Dashboard
- 📊 **Stats** – Revenue, orders, users, products, low-stock alerts, recent orders
- 🏷️ **Product Management** – Create, edit, delete, featured toggle
- 📦 **Order Management** – View all orders, update status (CONFIRMED → SHIPPED → DELIVERED)
- 🗂️ **Category Management** – Create, list, delete categories

---

## 🏗️ Architecture

```
E-Commerce/
├── backend/               # Express.js REST API (TypeScript)
│   ├── prisma/            # Prisma schema + SQLite database + seed script
│   ├── src/
│   │   ├── config/        # Environment configuration
│   │   ├── controllers/   # auth, product, cart, wishlist, order, payment, review, admin
│   │   ├── middleware/     # JWT auth, admin authorization, error handling
│   │   ├── routes/        # Modular Express routers
│   │   └── utils/         # Prisma client, JWT helpers
│   └── tests/             # 5 Vitest test suites (18 assertions)
│
└── frontend/              # Vite + React 18 + TypeScript + Tailwind CSS
    └── src/
        ├── components/    # All UI components (Navbar, Cards, Modals, Drawers, Admin)
        ├── context/       # AuthContext, CartContext, WishlistContext
        ├── services/      # Axios API client with JWT interceptor
        └── types/         # TypeScript interfaces
```

---

## 🛠️ Technology Stack

| Layer       | Technology                                        |
|-------------|---------------------------------------------------|
| Frontend    | React 18, TypeScript, Vite, Tailwind CSS          |
| Backend     | Node.js, Express.js, TypeScript                   |
| Database    | Prisma ORM, SQLite (production: PostgreSQL ready) |
| Auth        | JWT (jsonwebtoken), bcryptjs password hashing     |
| Payments    | Stripe architecture (test mode) + test simulator  |
| Testing     | Vitest, Supertest                                 |
| Icons       | Lucide React                                      |

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** v18+ and **npm** v9+
- **Git**

### 1. Clone & Install

```bash
git clone https://github.com/VenkateshNasana/E-commerce-Application.git
cd E-commerce-Application

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
# Backend: Copy .env.example to .env
cd backend
cp ../.env.example .env
```

Required environment variables (see `.env.example`):

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_secret_here
CORS_ORIGIN=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_... # Optional: for real Stripe integration
```

### 3. Setup Database

```bash
cd backend

# Push schema to SQLite
npx prisma db push

# Seed development data (products, users, coupons)
npm run db:seed
```

This creates:
- 5 product categories with 10 featured gaming products
- **Admin account**: `admin@nexusgaming.com` / `Admin@123456`
- **Customer account**: `user@nexusgaming.com` / `User@123456`
- Coupon codes: `GAMER10` (10% off), `NEXUS25` ($25 off)

### 4. Start Development Servers

**Terminal 1 - Backend API:**
```bash
cd backend
npm run dev
# API running at http://localhost:5000/api/v1
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App running at http://localhost:3000
```

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

**5 Test Suites / 18 Test Cases:**

| Suite | Tests |
|-------|-------|
| `auth.test.ts` | Registration, login, duplicate email, invalid password, profile fetch |
| `product.test.ts` | Category listing, pagination, search, product by slug, 404 handling |
| `cart.test.ts` | Cart fetch, add item, wishlist toggle |
| `order.test.ts` | Order creation with coupon, order history |
| `admin.test.ts` | Customer blocked (403), admin stats access, all orders access |

---

## 🌐 API Overview

Base URL: `http://localhost:5000/api/v1`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register` | POST | ❌ | Register new user |
| `/auth/login` | POST | ❌ | Login, returns JWT |
| `/auth/me` | GET | ✅ | Get current user |
| `/auth/profile` | PUT | ✅ | Update profile |
| `/auth/addresses` | POST | ✅ | Add delivery address |
| `/products` | GET | ❌ | List/search/filter products |
| `/products/:slug` | GET | ❌ | Product detail + reviews |
| `/products` | POST | 🛡️ Admin | Create product |
| `/products/:id` | PUT | 🛡️ Admin | Update product |
| `/products/:id` | DELETE | 🛡️ Admin | Delete product |
| `/categories` | GET | ❌ | List all categories |
| `/cart` | GET | ✅ | Get user cart |
| `/cart/add` | POST | ✅ | Add item to cart |
| `/cart/items/:id` | PUT | ✅ | Update cart item quantity |
| `/cart/items/:id` | DELETE | ✅ | Remove item from cart |
| `/wishlist` | GET | ✅ | Get wishlist |
| `/wishlist/toggle` | POST | ✅ | Add/remove from wishlist |
| `/orders` | POST | ✅ | Create order (from cart) |
| `/orders/my-orders` | GET | ✅ | User order history |
| `/orders/:id` | GET | ✅ | Order detail |
| `/orders/admin/all` | GET | 🛡️ Admin | All orders |
| `/orders/admin/:id/status` | PUT | 🛡️ Admin | Update order status |
| `/payments/create-intent` | POST | ✅ | Create payment intent |
| `/reviews` | POST | ✅ | Submit review |
| `/admin/stats` | GET | 🛡️ Admin | Dashboard analytics |
| `/admin/users` | GET | 🛡️ Admin | All users |

---

## 💳 Payment Configuration

The application uses a **dual payment architecture**:

1. **Stripe Live Test Mode** – Uses your `STRIPE_SECRET_KEY` from `.env`. If a valid Stripe test key (`sk_test_...`) is provided, real Stripe test payment intents are created.

2. **Test Gateway Simulator** – If no valid Stripe key is provided, the system falls back to a safe built-in payment simulator that mirrors the same API contract without making real API calls.

To enable Stripe test mode:
```env
STRIPE_SECRET_KEY=sk_test_<your_stripe_test_key>
STRIPE_WEBHOOK_SECRET=whsec_<your_webhook_secret>
```

> ⚠️ **Never commit real Stripe keys.** The `.gitignore` excludes all `.env` files.

---

## 🔒 Security

- Passwords hashed with **bcryptjs** (10 salt rounds)
- Authentication via **JWT Bearer tokens** (7-day expiry)
- All admin routes protected by **role-based middleware** (`ROLE_ADMIN` check)
- **Backend price recalculation** on every order - frontend prices are never trusted
- **Stock validation** before checkout
- **No secrets committed** - `.env` files excluded from Git
- CORS configured for frontend origin only
- SQL injection prevented via **Prisma parameterized queries**

---

## 📦 Production Build

```bash
# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build

# Frontend static files will be in frontend/dist/
```

---

## 🔄 Git Commit History

1. `chore: initialize project architecture and repository settings`
2. `feat: implement backend API, database models with Prisma ORM, seed data, and automated unit test suites`
3. `feat: build responsive cyberpunk gaming frontend UI with all components`
4. `feat: integrate full-stack features - cart, checkout, orders, admin dashboard`
5. `docs: add comprehensive setup, API, and deployment documentation`

---

## 🐛 Troubleshooting

**Backend won't start:**
- Ensure `backend/.env` exists with `DATABASE_URL`
- Run `npx prisma db push` to create the database

**Tests fail:**
- Run `npm run db:seed` to ensure test data exists
- Tests depend on seeded user accounts

**Frontend can't connect to API:**
- Verify backend is running on port 5000
- Vite proxy is configured to forward `/api` → `http://localhost:5000`

**"Product not found" errors:**
- Run `npm run db:seed` in the backend directory to re-seed the database

---

## 👥 Developer Credentials (Test Only)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@nexusgaming.com` | `Admin@123456` |
| Customer | `user@nexusgaming.com` | `User@123456` |

> These credentials are for development/testing only and are auto-generated by the seed script.
