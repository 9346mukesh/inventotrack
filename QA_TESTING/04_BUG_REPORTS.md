# BUG REPORTS - InventoTrack E-Commerce Platform

**Report Date:** February 4, 2026  
**Version:** 1.0

---

## BUG REPORT #1

**Bug ID:** BUG-001  
**Title:** Login accepts empty password field  
**Module:** Authentication  
**Severity:** CRITICAL  
**Priority:** P1 - Must Fix Before Release  
**Status:** Open  
**Assigned To:** Backend Team  
**Reporter:** QA Team  
**Date Reported:** February 4, 2026  

### Steps to Reproduce:
1. Navigate to login page
2. Enter valid email address (test@example.com)
3. Leave password field completely empty
4. Click "Login" button
5. Observe system behavior

### Expected Result:
Error message should appear: "Password is required"  
Login should NOT proceed with empty password  
User should remain on login page

### Actual Result:
Application accepts empty password field  
User is logged in despite providing no password  
Session is created and user is redirected to dashboard  
System logs show authentication bypassed

### Severity Justification:
This is a CRITICAL security vulnerability. It allows:
- Unauthorized access to user accounts
- Potential data breach
- Violation of security standards
- Compromised application integrity

### Browser & Environment:
- Browser: Chrome 120.0.0
- OS: macOS 13.1
- Environment: Development/Staging
- Screen Resolution: 1920x1080

### Steps to Verify Fix:
1. Apply password validation fix
2. Attempt login with empty password
3. Verify error message appears
4. Confirm user cannot proceed without password

### Attachments/Screenshots:
```
Login Form Screenshot:
- Email field: test@example.com
- Password field: [EMPTY]
- Result: Login successful (UNEXPECTED)
```

### Root Cause Analysis:
The password validation is missing in the login controller.  
File: backend/src/controllers/auth.controller.js  
Missing check: if (!password) return error;

### Suggested Fix:
Add validation in auth.controller.js line 45:
```javascript
if (!email || !password) {
  return res.status(400).json({ message: "Email and password are required" });
}
```

---

## BUG REPORT #2

**Bug ID:** BUG-002  
**Title:** Cart items not persisting after page refresh  
**Module:** Shopping Cart  
**Severity:** HIGH  
**Priority:** P1 - Must Fix  
**Status:** Open  
**Assigned To:** Frontend Team  
**Reporter:** QA Team  
**Date Reported:** February 4, 2026  

### Steps to Reproduce:
1. Log in with valid credentials
2. Navigate to product listing page
3. Add 3 different products to cart with various quantities:
   - Laptop (Qty: 2) - Price: $999.99
   - USB Cable (Qty: 5) - Price: $9.99
   - Monitor (Qty: 1) - Price: $349.99
4. Verify cart count shows 3 items
5. Refresh the page (F5 or Cmd+R)
6. Check cart contents

### Expected Result:
- All 3 products remain in cart
- Quantities are preserved
- Cart count remains 3
- Subtotal remains: $2,384.91
- Cart is visible when user clicks cart icon

### Actual Result:
- After page refresh, cart is completely empty
- Cart count shows 0
- All items are lost
- User has to re-add products
- Cart data is not retrieved from storage

### Severity Justification:
This is HIGH severity because:
- Degrades user experience significantly
- Users lose their shopping context
- Increases cart abandonment rate
- Negative impact on conversion metrics
- Critical for e-commerce functionality

### Browser & Environment:
- Browser: Firefox 122.0
- OS: macOS 13.1
- Environment: Staging
- Screen Resolution: 1440x900
- LocalStorage: Enabled

### Steps to Verify Fix:
1. Apply localStorage persistence fix
2. Add items to cart
3. Refresh page multiple times
4. Verify items persist across refreshes
5. Close and reopen browser
6. Verify items still exist (if intended)

### Attachments/Screenshots:
```
Before Refresh:
Cart Count: 3
Items: Laptop (2), USB Cable (5), Monitor (1)
Total: $2,384.91

After Refresh:
Cart Count: 0
Items: NONE
Total: $0
```

### Root Cause Analysis:
Cart state is stored in React Context but not synced with localStorage.  
When page refreshes, Context state is reset to default empty state.  
File: frontend/src/context/CartContext.jsx  
Missing: localStorage integration on mount and updates

### Suggested Fix:
Update CartContext.jsx to implement localStorage:

```javascript
// On component mount
useEffect(() => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
}, []);

// On cart change
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(cart));
}, [cart]);
```

---

## BUG REPORT #3

**Bug ID:** BUG-003  
**Title:** Duplicate orders being created during payment processing  
**Module:** Payment/Orders  
**Severity:** HIGH  
**Priority:** P1 - Must Fix  
**Status:** Open  
**Assigned To:** Backend Team  
**Reporter:** QA Team  
**Date Reported:** February 4, 2026  

### Steps to Reproduce:
1. Log in as user
2. Add products to cart (total: $100.00)
3. Complete checkout process
4. Enter shipping and billing information
5. On payment page, enter test card: 4242 4242 4242 4242
6. Enter expiry: 12/25, CVV: 123
7. Click "Pay Now" button
8. Wait for 3-5 seconds without navigating away
9. Check order history
10. Check database directly

### Expected Result:
- One order created with status "Confirmed"
- Payment processed once
- User sees success page once
- Order confirmation email sent once
- Order ID: unique reference

### Actual Result:
- TWO orders created with identical details
- Both orders show status "Confirmed"
- Both orders have same total ($100.00)
- Two order confirmation emails sent
- Stripe charged customer twice
- User sees duplicate order in order history
- Database contains duplicate records

### Severity Justification:
This is HIGH/CRITICAL because:
- Customers are charged multiple times
- Duplicate orders cause inventory issues
- Violates payment regulations
- Financial impact on customer satisfaction
- Can trigger payment disputes and chargebacks
- Damages business reputation

### Browser & Environment:
- Browser: Chrome 120.0.0
- OS: Windows 10
- Environment: Staging
- Test Card: 4242 4242 4242 4242
- Amount: $100.00

### Financial Impact:
- Customer charged: $200.00 (instead of $100.00)
- Refund required: $100.00
- Stripe fees applied twice
- Customer support overhead

### Steps to Verify Fix:
1. Process test payment again
2. Monitor order creation in real-time
3. Verify only ONE order created
4. Verify only ONE charge in Stripe
5. Check database for duplicates
6. Verify single confirmation email sent

### Database Evidence:
```sql
SELECT * FROM orders WHERE user_id = 'user123' AND created_at > NOW() - INTERVAL '5 minutes';

Order 1:
- order_id: ORD_001
- amount: $100.00
- status: Confirmed
- created_at: 2026-02-04 10:30:45

Order 2:
- order_id: ORD_002
- amount: $100.00
- status: Confirmed
- created_at: 2026-02-04 10:30:46 (1 second later)
```

### Root Cause Analysis:
The payment webhook handler is not idempotent.  
Multiple webhook calls from Stripe create duplicate orders.  
Missing: Idempotency key handling in payment processing.  
File: backend/src/controllers/payment.controller.js  
File: backend/src/routes/webhook.routes.js

### Suggested Fix:
Implement idempotency key in payment processing:

```javascript
// Generate idempotency key for this transaction
const idempotencyKey = `${userId}_${cartId}_${Date.now()}`;

// Check if order already exists with this key
const existingOrder = await Order.findOne({ idempotencyKey });
if (existingOrder) {
  return res.json({ order: existingOrder });
}

// Create new order only if doesn't exist
const newOrder = await Order.create({
  userId,
  items: cartItems,
  total: cartTotal,
  idempotencyKey,
  status: 'Confirmed'
});
```

---

## BUG REPORT #4

**Bug ID:** BUG-004  
**Title:** Admin cannot upload product images with certain file formats  
**Module:** Admin - Product Management  
**Severity:** MEDIUM  
**Priority:** P2 - Fix Before Next Release  
**Status:** Open  
**Assigned To:** Backend Team  
**Reporter:** QA Team  
**Date Reported:** February 4, 2026  

### Steps to Reproduce:
1. Log in as admin
2. Navigate to Add Product page
3. Fill in product details:
   - Name: Test Headphones
   - Price: $99.99
   - Stock: 50
4. Try to upload product image in WebP format (headphones.webp)
5. Observe upload result

### Expected Result:
- WebP format should be accepted
- Image should upload successfully
- Image should display in product preview
- Image URL should be saved in database

### Actual Result:
- Upload fails silently
- No error message displayed
- Image is not saved
- Product creation proceeds without image
- Product appears without thumbnail
- User confused about why image didn't upload

### Severity Justification:
MEDIUM severity because:
- Affects admin experience but not critical
- Users can work around with JPG/PNG
- WebP is modern format, should be supported
- Customers see products without images (quality issue)
- No data loss, just missing images

### Browser & Environment:
- Browser: Chrome 120.0.0
- OS: macOS
- Environment: Staging
- File Format: WebP (1920x1080, 350KB)
- Cloudinary Account: Connected

### Supported vs Unsupported:
```
✓ WORKING:
  - JPG/JPEG
  - PNG
  - GIF

✗ NOT WORKING:
  - WebP
  - SVG
  - HEIC
```

### Steps to Verify Fix:
1. Apply file format support update
2. Try uploading WebP image
3. Verify upload succeeds
4. Verify image displays correctly
5. Verify image accessible in product page
6. Check Cloudinary for image storage

### Root Cause Analysis:
Image upload validation only whitelists specific formats.  
WebP format is not in the accepted list.  
File: backend/src/utils/cloudinaryUpload.js  
Missing: WebP and other modern formats

### Suggested Fix:
Update allowed formats in upload utility:
```javascript
const allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
const maxFileSize = 5 * 1024 * 1024; // 5MB

if (!allowedFormats.includes(fileExtension.toLowerCase())) {
  throw new Error(`Format not supported. Allowed: ${allowedFormats.join(', ')}`);
}
```

---

## BUG SUMMARY REPORT

| Bug ID | Title | Module | Severity | Status | Impact |
|--------|-------|--------|----------|--------|--------|
| BUG-001 | Empty password login | Authentication | CRITICAL | Open | Security breach - unauthorized access |
| BUG-002 | Cart not persisting | Shopping Cart | HIGH | Open | Users lose shopping context after refresh |
| BUG-003 | Duplicate orders created | Payment | HIGH | Open | Customer charged twice - financial impact |
| BUG-004 | WebP image upload fails | Admin | MEDIUM | Open | Products without images - quality degradation |

---

## Metrics

- **Total Bugs Found:** 4
- **Critical Bugs:** 1
- **High Priority Bugs:** 2
- **Medium Priority Bugs:** 1
- **Open/Unresolved:** 4
- **Fixed:** 0
- **Pass Rate:** 93.65% (59/63 test cases passed)

---

**Report Generated By:** QA Team  
**Report Date:** February 4, 2026  
**Next Review Date:** February 11, 2026  
**Status:** NEEDS IMMEDIATE ATTENTION - 1 Critical Security Issue
