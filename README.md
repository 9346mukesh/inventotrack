# 🛒 InventoTrack - E-Commerce Inventory Management System

A full-stack e-commerce platform with real-time inventory management, Amazon-style cart features, and secure payment processing using Stripe.

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Key Features Explained](#-key-features-explained)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🛍️ Customer Features
- **User Authentication** - Secure JWT-based authentication and authorization
- **Product Browsing** - Search, filter, and sort products by category/price
- **Shopping Cart** - Real-time cart with stock reservation (15-minute hold)
- **Save for Later** - Amazon-style save items for future purchase
- **Secure Checkout** - Integrated Stripe payment gateway
- **Order History** - Track all past orders with detailed status
- **Responsive Design** - Mobile-first design with Tailwind CSS

### 👨‍💼 Admin Features
- **Product Management** - Create, update, delete products with image uploads
- **Inventory Control** - Real-time stock tracking with low-stock alerts
- **Order Management** - View and manage all customer orders
- **Analytics Dashboard** - Sales metrics, revenue tracking, and insights
- **Category Management** - Organize products by categories

### 🔒 Advanced Inventory System
- **Stock Reservation** - Automatic 15-minute cart hold prevents overselling
- **Real-time Updates** - Live stock availability across all users
- **Auto-Release Cron** - Abandoned cart items auto-release after expiry
- **Concurrent Safety** - Race condition protection for high-traffic scenarios
- **Low Stock Alerts** - Configurable thresholds per product

### 💳 Payment Features
- **Stripe Integration** - PCI-compliant secure payment processing
- **Webhook Automation** - Real-time payment status updates
- **Payment Verification** - Client-side and server-side validation
- **Test Mode Ready** - Full test card support for development

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe API
- **Security**: bcrypt, CORS, express validators
- **Scheduling**: node-cron (for stock release automation)

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API (Auth, Cart)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Payment UI**: Stripe Elements (@stripe/react-stripe-js)

### DevOps & Deployment
- **Database Hosting**: MongoDB Atlas (Free M0 Tier)
- **Backend Hosting**: Render.com (Free Tier)
- **Frontend Hosting**: Vercel (Free Tier)
- **Version Control**: Git & GitHub

## 🏗️ Architecture

```
┌─────────────────┐
│   React SPA     │  ← Frontend (Vercel)
│   Vite + React  │
└────────┬────────┘
         │ HTTPS/REST API
         ↓
┌─────────────────┐
│  Express.js API │  ← Backend (Render)
│   + Stripe      │
└────────┬────────┘
         │ Mongoose ODM
         ↓
┌─────────────────┐
│  MongoDB Atlas  │  ← Database (Cloud)
└─────────────────┘
         ↑
         │ Webhooks
┌─────────────────┐
│  Stripe         │  ← Payment Gateway
└─────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas account)
- Stripe account (free test mode)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/inventotrack.git
   cd inventotrack
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   
   # Edit .env with your credentials:
   # - MONGO_URI (MongoDB connection string)
   # - JWT_SECRET (random secure string)
   # - STRIPE_SECRET_KEY (from Stripe Dashboard)
   # - STRIPE_WEBHOOK_SECRET (from Stripe Webhooks)
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Create .env file
   cp .env.example .env
   
   # Edit .env:
   # - VITE_API_URL=http://localhost:5001/api
   # - VITE_STRIPE_PUBLISHABLE_KEY (from Stripe Dashboard)
   ```

4. **Start Development Servers**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on: `http://localhost:5001`
   
   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

5. **Access the Application**
   - Open browser: `http://localhost:5173`
   - Register a new account or login
   - Admin credentials (create manually in DB with `role: "admin"`)

### Testing Stripe Payments

Use these test cards in checkout:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 9995` | Declined |
| `4000 0025 0000 3155` | Requires authentication |

- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

## 📦 Deployment

See **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for complete step-by-step instructions to deploy this project **100% FREE** using:

- ✅ MongoDB Atlas (Free 512MB)
- ✅ Render.com (Free backend hosting)
- ✅ Vercel (Free frontend hosting)
- ✅ Stripe (Free test mode)

**Deployment Time**: ~30 minutes

## 📡 API Documentation

### Base URL
- **Development**: `http://localhost:5001/api`
- **Production**: `https://your-app.onrender.com/api`

### Endpoints Overview

#### Authentication
```
POST   /auth/register     # Register new user
POST   /auth/login        # Login user
GET    /auth/me           # Get current user profile (protected)
```

#### Products (Public)
```
GET    /products          # Get all products (with filters/pagination)
GET    /products/:id      # Get single product details
```

#### Admin Products (Protected - Admin Only)
```
GET    /admin/products              # Get all products (admin view)
POST   /admin/products              # Create new product
PUT    /admin/products/:id          # Update product
DELETE /admin/products/:id          # Delete product
GET    /admin/products/categories   # Get all categories
```

#### Cart (Protected)
```
GET    /cart                        # Get user's cart
POST   /cart/add                    # Add item to cart
PUT    /cart/update                 # Update cart item quantity
DELETE /cart/remove/:productId      # Remove item from cart
POST   /cart/save-for-later/:id     # Move item to "Save for Later"
POST   /cart/move-to-cart/:id       # Move item back to cart
```

#### Orders (Protected)
```
POST   /orders            # Create order from cart
GET    /orders            # Get user's orders
GET    /orders/all        # Get all orders (admin only)
```

#### Payments (Protected)
```
POST   /payments/create-intent   # Create Stripe PaymentIntent
POST   /payments/verify          # Verify payment status
```

#### Webhooks
```
POST   /webhooks/stripe   # Stripe payment webhooks (raw body)
```

### Authentication

Protected routes require JWT token in Authorization header:
```bash
Authorization: Bearer <your_jwt_token>
```

## 📁 Project Structure

```
inventotrack/
├── backend/
│   ├── src/
│   │   ├── config/           # Database & Stripe configuration
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Auth, admin, validation
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API route definitions
│   │   ├── utils/            # Helper functions
│   │   ├── cron/             # Scheduled jobs (stock release)
│   │   ├── env.js            # Environment loader
│   │   └── server.js         # Express app entry point
│   ├── .env.example          # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios API clients
│   │   ├── components/       # Reusable React components
│   │   ├── context/          # React Context (Auth, Cart)
│   │   ├── layouts/          # Layout wrappers
│   │   ├── pages/            # Page components
│   │   │   ├── admin/        # Admin dashboard pages
│   │   │   └── user/         # Customer-facing pages
│   │   ├── routes/           # Protected route wrappers
│   │   ├── styles/           # CSS files
│   │   ├── utils/            # Helper functions
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # React entry point
│   ├── .env.example          # Environment variables template
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── vite.config.js        # Vite configuration
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md       # Step-by-step deployment instructions
├── WEBHOOK_SETUP.md          # Stripe webhook configuration
├── KEEP_WARM.md              # Solutions for cold-start issues
└── README.md                 # This file
```

## 🔑 Key Features Explained

### 1. Amazon-Style Stock Reservation

When a user adds items to their cart, the stock is **reserved for 15 minutes**:

```javascript
// Product Model
{
  stock: 100,           // Total physical stock
  reservedStock: 15,    // Items currently in carts
  availableStock: 85    // Virtual field: stock - reservedStock
}
```

**Benefits**:
- ✅ Prevents overselling in high-traffic scenarios
- ✅ Creates urgency for users to complete checkout
- ✅ Auto-releases after 15 minutes via cron job

### 2. Secure Payment Flow

1. User creates order → Order marked as "Pending"
2. Frontend creates PaymentIntent via backend
3. User completes payment with Stripe Elements
4. Two verification paths:
   - **Webhook** (primary): Stripe → Backend
   - **Client verify** (fallback): Frontend → Backend → Stripe
5. Stock deducted, cart cleared, order marked "Paid"

**Security Features**:
- ✅ Payment amount validation
- ✅ Currency verification
- ✅ Duplicate payment prevention
- ✅ Webhook signature verification

### 3. Cron Job - Auto Stock Release

```javascript
// Runs every minute
cron.schedule("* * * * *", async () => {
  // Find carts inactive for 15+ minutes
  const expiredCarts = await Cart.find({
    updatedAt: { $lt: Date.now() - 15 * 60 * 1000 }
  });
  
  // Release reserved stock
  for (const cart of expiredCarts) {
    for (const item of cart.items) {
      await releaseStock(item.product, item.quantity);
    }
  }
});
```

### 4. Role-Based Access Control

- **Customer**: Browse, cart, checkout, view own orders
- **Admin**: All customer features + product/inventory management

```javascript
// Middleware checks user role
const adminAuth = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Test thoroughly before submitting PR
- Update documentation for new features
- Add comments for complex logic

## 🐛 Known Issues & Limitations

- **Render Free Tier**: Backend spins down after 15 mins inactivity (30-60s cold start)
  - **Solution**: Use [KEEP_WARM.md](KEEP_WARM.md) strategies
- **Image Upload**: Currently using Cloudinary (setup required)
- **Email Notifications**: Not implemented (future feature)
- **Shipping Integration**: Not included (can be added)

## 🔮 Future Enhancements

- [ ] Email notifications (order confirmations, shipping updates)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced analytics dashboard
- [ ] Multi-currency support
- [ ] Shipping provider integration
- [ ] Real-time chat support
- [ ] Mobile app (React Native)
- [ ] AI-powered product recommendations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Stripe](https://stripe.com) - Payment processing
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database hosting
- [Render](https://render.com) - Backend hosting
- [Vercel](https://vercel.com) - Frontend hosting
- [Tailwind CSS](https://tailwindcss.com) - UI framework

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/inventotrack/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/inventotrack/discussions)
- **Documentation**: [Wiki](https://github.com/YOUR_USERNAME/inventotrack/wiki)

---

<div align="center">

**Made with ❤️ by Mukesh Kumar Reddy**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/YOUR_USERNAME/inventotrack/issues) · [Request Feature](https://github.com/YOUR_USERNAME/inventotrack/issues)

</div>
