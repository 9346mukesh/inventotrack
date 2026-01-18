# 🚀 Free Cloud Deployment Guide for InventoTrack

This guide walks you through deploying your InventoTrack application to the cloud completely **FREE**.

## 📋 Architecture Overview

- **Database**: MongoDB Atlas (Free M0 Cluster - 512MB)
- **Backend**: Render.com (Free Tier)
- **Frontend**: Vercel (Free Tier)
- **Payment**: Stripe (Test Mode - Free)

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with your email or Google account
3. Choose **FREE** M0 cluster (512MB storage)

### 1.2 Create a Cluster
1. Choose **AWS** as cloud provider
2. Select a region close to your users (e.g., Mumbai for India)
3. Keep cluster name as default or name it `inventotrack`
4. Click **Create Cluster** (takes 3-5 minutes)

### 1.3 Setup Database Access
1. Go to **Database Access** → **Add New Database User**
2. Authentication: **Password**
3. Username: `inventotrack_user`
4. Password: Generate a strong password (save it!)
5. Database User Privileges: **Read and write to any database**
6. Click **Add User**

### 1.4 Setup Network Access
1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - This is required for Render.com to connect
3. Click **Confirm**

### 1.5 Get Connection String
1. Go to **Database** → **Connect** → **Connect your application**
2. Driver: **Node.js**
3. Copy the connection string:
   ```
   mongodb+srv://inventotrack_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name after `.net/`: 
   ```
   mongodb+srv://inventotrack_user:yourpassword@cluster0.xxxxx.mongodb.net/inventotrack?retryWrites=true&w=majority
   ```
6. **Save this connection string** - you'll need it for backend deployment

---

## 🔧 Step 2: Setup Stripe (Payment Gateway)

### 2.1 Create Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a free account
3. **Stay in Test Mode** (free forever for testing)

### 2.2 Get API Keys
1. Go to **Developers** → **API keys**
2. Copy these keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)
3. **Save these keys** - you'll need them later

### 2.3 Setup Webhook (After Backend Deployment)
**Do this AFTER deploying backend in Step 3**
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://your-backend-url.onrender.com/api/webhooks/stripe`
   - Replace with your actual Render backend URL
4. Events to send:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)
7. **Save this webhook secret** - you'll add it to Render

---

## 🖥️ Step 3: Deploy Backend to Render.com

### 3.1 Create Render Account
1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub (recommended for easier deployment)

### 3.2 Connect GitHub Repository
1. Push your code to GitHub if not already done:
   ```bash
   cd /Users/mukeshkumarreddy/inventotrack
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/inventotrack.git
   git push -u origin main
   ```

### 3.3 Create Web Service
1. In Render Dashboard, click **New** → **Web Service**
2. Connect your GitHub repository: `inventotrack`
3. Configure:
   - **Name**: `inventotrack-backend`
   - **Region**: Choose closest to your MongoDB region
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Plan**: **Free** (select free tier)

### 3.4 Setup Environment Variables
Click **Advanced** → **Add Environment Variable** and add these:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `PORT` | `5001` | Render will override this |
| `MONGO_URI` | Your MongoDB connection string | From Step 1.5 |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-in-production` | Use a strong random string |
| `STRIPE_SECRET_KEY` | `sk_test_...` | From Step 2.2 |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | From Step 2.3 (add after webhook setup) |

### 3.5 Deploy
1. Click **Create Web Service**
2. Wait 3-5 minutes for deployment
3. Your backend URL: `https://inventotrack-backend.onrender.com`
4. Test health endpoint: `https://inventotrack-backend.onrender.com/api/health`

### 3.6 Complete Stripe Webhook Setup
**Go back to Step 2.3** and setup the webhook with your Render URL, then add `STRIPE_WEBHOOK_SECRET` to Render environment variables.

---

## 🌐 Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account
1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)

### 4.2 Update Frontend API URL
Before deploying, update the backend API URL in your frontend:

1. Edit `frontend/src/api/axios.js`:
   ```javascript
   import axios from "axios";

   const instance = axios.create({
     baseURL: import.meta.env.VITE_API_URL || "https://inventotrack-backend.onrender.com/api"
   });

   // ... rest of the file
   ```

2. Create `frontend/.env.production`:
   ```env
   VITE_API_URL=https://inventotrack-backend.onrender.com/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
   Replace with your actual Render backend URL and Stripe publishable key.

3. Commit changes:
   ```bash
   git add .
   git commit -m "Configure production API URL"
   git push
   ```

### 4.3 Deploy to Vercel
1. In Vercel Dashboard, click **Add New** → **Project**
2. Import your GitHub repository: `inventotrack`
3. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL`: `https://inventotrack-backend.onrender.com/api`
   - `VITE_STRIPE_PUBLISHABLE_KEY`: `pk_test_...`
5. Click **Deploy**
6. Wait 2-3 minutes for deployment
7. Your frontend URL: `https://inventotrack.vercel.app`

---

## 🔄 Step 5: Update Backend CORS

After deploying frontend, update backend CORS settings:

### 5.1 Update Backend Code
Edit `backend/src/server.js`:

```javascript
// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:5173', // Local dev
    'http://localhost:5174',
    'https://inventotrack.vercel.app', // Your Vercel URL
    'https://inventotrack-*.vercel.app' // Vercel preview deployments
  ],
  credentials: true
}));
```

### 5.2 Redeploy Backend
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy on push.

---

## ✅ Step 6: Testing Your Deployment

### 6.1 Test Backend
1. Health check: `https://inventotrack-backend.onrender.com/api/health`
2. Expected response: `{ "status": "ok", "service": "InventoTrack Backend", "environment": "production" }`

### 6.2 Test Frontend
1. Visit: `https://inventotrack.vercel.app`
2. Register a new user
3. Login
4. Browse products
5. Add items to cart

### 6.3 Test Payment Flow
1. Create order
2. Use Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
3. Verify order status updates

---

## 🚨 Important Notes

### Free Tier Limitations

#### Render.com (Backend)
- ✅ 750 hours/month (enough for 1 app 24/7)
- ⚠️ **Spins down after 15 mins of inactivity** (first request takes 30-60 seconds)
- ✅ Automatic HTTPS
- ⚠️ Max 512MB RAM

#### Vercel (Frontend)
- ✅ Unlimited bandwidth
- ✅ Instant global CDN
- ✅ Automatic HTTPS
- ✅ No sleep/spin-down issues

#### MongoDB Atlas (Database)
- ✅ 512MB storage (enough for ~10,000 products)
- ✅ No sleep/downtime
- ⚠️ Shared cluster (slower performance)

### Cold Start Issue (Render)
**Problem**: Backend takes 30-60 seconds on first request after inactivity.

**Solutions**:
1. **Keep-Alive Service** (Free):
   - Use [cron-job.org](https://cron-job.org) to ping your health endpoint every 10 minutes
   - URL: `https://inventotrack-backend.onrender.com/api/health`
   - Keeps backend warm

2. **Upgrade to Paid** ($7/month):
   - No cold starts
   - Always-on instance

---

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string (use: `openssl rand -base64 32`)
- [ ] Never commit `.env` files to Git
- [ ] Keep Stripe in test mode until ready for production
- [ ] Setup MongoDB backup strategy (manual exports for free tier)
- [ ] Monitor Render logs for errors
- [ ] Setup MongoDB Atlas alerts for storage usage

---

## 📊 Monitoring & Logs

### Backend Logs (Render)
1. Go to Render Dashboard
2. Select your service
3. Click **Logs** tab
4. Real-time logs of all requests and errors

### Frontend Logs (Vercel)
1. Go to Vercel Dashboard
2. Select your project
3. Click **Deployments** → **Functions** logs
4. View build logs and runtime errors

### Database Monitoring (MongoDB Atlas)
1. Go to Atlas Dashboard
2. Click **Metrics** tab
3. Monitor:
   - Storage usage
   - Connection count
   - Query performance

---

## 🆙 Upgrade Path (When You're Ready)

### Basic Plan (~$15/month total)
- Render Starter: $7/month (no cold starts, 512MB RAM)
- MongoDB M2: $9/month (2GB storage, better performance)
- Vercel Pro: $20/month (advanced features, but free tier is usually enough)

### Production Stripe
- Free to use (2.9% + 30¢ per transaction)
- No monthly fees
- Switch from test mode to live mode

---

## 🐛 Troubleshooting

### Backend Won't Start
- Check Render logs for errors
- Verify all environment variables are set
- Test MongoDB connection string locally first

### Frontend Can't Connect to Backend
- Check CORS settings in backend
- Verify `VITE_API_URL` in Vercel environment variables
- Check Network tab in browser DevTools

### Webhook Not Working
- Verify webhook URL in Stripe Dashboard
- Check `STRIPE_WEBHOOK_SECRET` is set correctly
- Test webhook with Stripe CLI: `stripe listen --forward-to localhost:5001/api/webhooks/stripe`

### Payment Fails
- Ensure you're using test card: `4242 4242 4242 4242`
- Check Stripe is in test mode
- Verify webhook events are being received

---

## 📞 Support Resources

- **Render**: [https://render.com/docs](https://render.com/docs)
- **Vercel**: [https://vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas**: [https://docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Stripe**: [https://stripe.com/docs](https://stripe.com/docs)

---

## 🎉 Congratulations!

Your InventoTrack application is now live on the cloud completely free! 

**Your URLs**:
- Frontend: `https://inventotrack.vercel.app`
- Backend: `https://inventotrack-backend.onrender.com`
- API Health: `https://inventotrack-backend.onrender.com/api/health`

Share your live app with the world! 🚀
