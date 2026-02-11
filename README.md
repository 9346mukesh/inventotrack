# 🛒 InventoTrack — Smart E-Commerce Inventory & Order Management System

InventoTrack is a **full-stack MERN e-commerce platform** designed with real-world inventory logic, cart reservation, and secure Stripe payments.

Built to simulate production-grade architecture with scalable backend design, secure workflows, and analytics-driven admin management.

## Live Website Demo

    https://inventotrack.vercel.app
    
## 🌐 Overview

Traditional e-commerce projects often ignore real inventory challenges like overselling, race conditions, and payment verification.

InventoTrack solves these problems through:

- Real-time stock reservation
- Concurrent order safety
- Secure payment workflows
- Admin analytics dashboard

This project demonstrates **enterprise-level backend engineering practices** suitable for modern SaaS platforms.

---

## ⭐ Key Highlights

- 🔐 JWT Authentication & Role-Based Access
- 📦 Amazon-Style 15-Minute Cart Reservation
- 💳 Stripe Secure Payment Integration
- 📊 Admin Analytics Dashboard
- ⚡ Real-Time Inventory Updates
- 🧪 QA Testing with 93.65% Pass Rate

---

## ✨ Features

### 🛍️ Customer Features

- Secure login & registration
- Product search, filtering & sorting
- Real-time shopping cart
- Save-for-Later functionality
- Stripe checkout
- Order history tracking
- Mobile-first UI using Tailwind CSS

### 👨‍💼 Admin Features

- Product CRUD management
- Inventory monitoring
- Low stock alerts
- Order management
- Revenue analytics dashboard

### 🔒 Advanced Inventory System

- 15-minute stock reservation engine
- Auto-release cron job
- Race-condition prevention
- Concurrent stock safety

### 💳 Payment System

- Stripe PaymentIntent integration
- Webhook automation
- Dual payment verification
- PCI-compliant checkout

---

## 🛠 Tech Stack

### Backend
- Node.js (v18+)
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Stripe API
- node-cron

### Frontend
- React 18 + Vite
- Tailwind CSS
- Context API
- Axios
- React Router
- Stripe Elements

### DevOps & Deployment
- MongoDB Atlas (Database)
- Render.com (Backend Hosting)
- Vercel (Frontend Hosting)
- GitHub (Version Control)

---



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
---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas account)
- Stripe account (free test mode)
- Git

### Installation

#### 1️⃣ Clone Repository
   ```bash
   git clone https://github.com/9346mukesh/inventotrack.git
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

## 🧪 Testing Results

**Manual QA Testing Phase**

### Test Summary
| Metric | Result |
|--------|--------|
| **Total Test Cases** | 63 |
| **Test Cases Passed** | 59 (93.65%) ✅ |
| **Test Cases Failed** | 4 (6.35%) ⚠️ |
| **Modules Tested** | 7/7 (100%) |
| **Browsers Tested** | Chrome, Firefox, Safari, Edge |
| **Devices Tested** | Desktop, Laptop, Tablet, Mobile |

### Key Findings
    •	Authentication: 100% Pass
    •	Checkout Flow: Stable
    •	Payment System: Verified
    •	Minor UI and cart persistence issues pending


### Complete QA Documentation
All testing documentation is available in the `/QA_TESTING/` folder.

## 📦 Deployment

- ✅ MongoDB Atlas (Free 512MB)
- ✅ Render.com (Free backend hosting)
- ✅ Vercel (Free frontend hosting)
- ✅ Stripe (Free test mode)

Refer to:  DEPLOYMENT_GUIDE.md


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

### 1. Stock Reservation

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


### 4. Role-Based Access Control

- **Customer**: Browse, cart, checkout, view own orders
- **Admin**: All customer features + product/inventory management

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

## 👨‍💻 Author
Mukesh Kumar Reddy
B.Tech – Computer Science & Engineering


</div>
