# ✅ FRESH DEPLOYMENT CHECKLIST - Step by Step

This is a clean redeployment guide. Follow each step carefully.

---

## 📋 PRE-DEPLOYMENT (Do These First)

### ✅ Step 0: Verify You Have These Ready

Before starting, make sure you have:

- [ ] **MongoDB Atlas Account** with connection string ready
  - Format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/inventotrack?retryWrites=true&w=majority`
  - Get from: MongoDB Atlas → Database → Connect → Drivers → Node.js

- [ ] **Stripe Test API Keys** ready
  - **Publishable Key** (starts with `pk_test_`)
  - **Secret Key** (starts with `sk_test_`)
  - Get from: https://dashboard.stripe.com/test/apikeys

- [ ] **JWT Secret** generated
  ```bash
  openssl rand -base64 32
  ```

- [ ] **Render Account** created (sign up with GitHub)

- [ ] **Vercel Account** created (sign up with GitHub)

---

## 🖥️ STEP 1: DEPLOY BACKEND TO RENDER (Fresh)

### 1.1 Go to Render Dashboard
- URL: https://dashboard.render.com
- Click **"+ New"** → **"Web Service"**

### 1.2 Connect Repository
- Select: **`9346mukesh/inventotrack`**
- Click **"Connect"**

### 1.3 Configure Service

Fill in these fields:

```
Name:                  inventotrack-backend
Region:                Virginia (US East) [or closest to you]
Branch:                main
Root Directory:        backend
Runtime:               Node
Build Command:         npm install
Start Command:         node src/server.js
Plan:                  FREE (scroll down to select)
```

### 1.4 Add Environment Variables

**BEFORE clicking Deploy**, add these variables:

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5001` |
| `MONGO_URI` | [Your MongoDB connection string] |
| `JWT_SECRET` | [Your generated JWT secret] |
| `STRIPE_SECRET_KEY` | [Your Stripe test secret key] |

**Example MONGO_URI:**
```
mongodb+srv://inventotrack_user:YourPassword123@cluster0.a1b2c3d4.mongodb.net/inventotrack?retryWrites=true&w=majority
```

### 1.5 Deploy

Click **"Deploy Web Service"** button

⏳ Wait 3-5 minutes for build...

### 1.6 Verify Backend is Live

Once deployed, you'll see a URL like:
```
https://inventotrack-backend-xxxx.onrender.com
```

**Test it:**
```
https://your-backend-url.onrender.com/api/health
```

**Should return:**
```json
{
  "status": "ok",
  "service": "InventoTrack Backend",
  "environment": "production"
}
```

✅ **Backend is LIVE!**

**Save this URL**: You'll need it for the next step.

---

## 🌐 STEP 2: SETUP STRIPE WEBHOOK

### 2.1 Go to Stripe Dashboard

URL: https://dashboard.stripe.com

Make sure you're in **TEST MODE** (toggle at top right)

### 2.2 Create Webhook Endpoint

1. Click **Developers** → **Webhooks**
2. Click **"Add an endpoint"**
3. Fill in:
   - **Endpoint URL**: `https://your-backend-url.onrender.com/api/webhooks/stripe`
   - (Replace with your actual Render URL from Step 1.6)

### 2.3 Select Events

Click **"Select events"** and choose:
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`

Click **"Add Events"**

### 2.4 Add Endpoint

Click **"Add endpoint"**

### 2.5 Copy Webhook Secret

After creation, you'll see your webhook.

Click on it to view details.

Find **"Signing secret"** and click **"Reveal"**

**Copy this value** (starts with `whsec_`)

**Save it!** You'll add it to Render next.

---

## 🔐 STEP 3: Add Webhook Secret to Render

### 3.1 Go Back to Render Dashboard

https://dashboard.render.com

### 3.2 Open Your Backend Service

Click on **inventotrack-backend**

### 3.3 Go to Environment Tab

Click **"Environment"** in left sidebar

### 3.4 Add New Variable

Click **"+ Add Environment Variable"**

Add:
- **Key**: `STRIPE_WEBHOOK_SECRET`
- **Value**: `whsec_...` (the secret you copied from Stripe)

Click **"Save Changes"**

✅ **Render will auto-redeploy** (watch the logs)

---

## 🎨 STEP 4: DEPLOY FRONTEND TO VERCEL (Fresh)

### 4.1 Update Frontend Code

Edit `frontend/src/api/axios.js` on **line 4**:

Change:
```javascript
baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"
```

To:
```javascript
baseURL: import.meta.env.VITE_API_BASE_URL || "https://YOUR-RENDER-BACKEND-URL.onrender.com/api"
```

Replace `YOUR-RENDER-BACKEND-URL` with your actual Render backend name.

### 4.2 Push Changes to GitHub

```bash
cd /Users/mukeshkumarreddy/inventotrack
git add frontend/src/api/axios.js
git commit -m "Update backend URL for production"
git push
```

### 4.3 Go to Vercel Dashboard

URL: https://vercel.com

### 4.4 Create New Project

Click **"Add New"** → **"Project"**

### 4.5 Import Repository

Select: **`9346mukesh/inventotrack`**

Click **"Import"**

### 4.6 Configure Project

**Framework Preset**: `Vite` (auto-detected)

**Root Directory**: Click **"Edit"** → Type `frontend` → Click **"Continue"**

**Build Settings** (should auto-fill):
- Build Command: `npm run build`
- Output Directory: `dist`

### 4.7 Add Environment Variables

Before deploying, add these:

| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://your-render-backend-url.onrender.com/api` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` (your Stripe publishable key) |
| `VITE_CLOUDINARY_CLOUD_NAME` | `dbl81b1pw` |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | `inventotrack` |

### 4.8 Deploy

Click **"Deploy"**

⏳ Wait 2-3 minutes...

### 4.9 Verify Frontend is Live

You'll get a URL like:
```
https://inventotrack.vercel.app
```

**Test it**: Open the URL in your browser ✅

---

## ✅ STEP 5: TEST THE FULL APPLICATION

### 5.1 Register New Account

1. Go to: `https://inventotrack.vercel.app`
2. Click **"Register"**
3. Enter email and password
4. Click **"Sign Up"**

✅ Account created!

### 5.2 Login

Click **"Login"** and enter your credentials

### 5.3 Add Product to Cart

1. Browse products
2. Click **"Add to Cart"**
3. View cart - should show your item

✅ Cart working!

### 5.4 TEST PAYMENT (Important!)

1. Click **"Checkout"**
2. Review order
3. Click **"Proceed to Payment"**
4. **Use test card**: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits
5. Click **"Pay Securely"**

**Expected**: Payment succeeds → You see "Payment Successful" page

✅ **DEPLOYMENT COMPLETE!**

---

## 🎯 Your Live URLs

```
Frontend:  https://inventotrack.vercel.app
Backend:   https://inventotrack-backend-xxxx.onrender.com
Health:    https://inventotrack-backend-xxxx.onrender.com/api/health
```

---

## 🐛 If Payment Fails

Check these:

1. **Is backend URL correct in frontend?**
   - Should be your Render URL, not localhost

2. **Are environment variables set in Render?**
   - Check all 5 variables (MONGO_URI, JWT_SECRET, etc.)

3. **Is Webhook Secret set?**
   - STRIPE_WEBHOOK_SECRET should be in Render

4. **Are you logged in?**
   - Must be logged in before checkout

5. **Using test card?**
   - Must use `4242 4242 4242 4242`

---

## 📞 Need Help?

If something fails:
1. Check Render logs: https://dashboard.render.com → your-service → Logs
2. Check browser DevTools (F12) → Console tab
3. Take screenshots and share the errors

