# QA TEST SCENARIOS - InventoTrack E-Commerce Platform

## Test Scenario Document
**Date:** February 4, 2026  
**Version:** 1.0

---

## TEST SCENARIO 1: User Registration and Email Verification
**Module:** Authentication  
**Priority:** High  
**Description:** Verify that a new user can successfully register with valid credentials and receive email verification.

**Pre-conditions:**
- Application is accessible
- Valid email address available
- Browser has cookies enabled

**Scenario Steps:**
1. Navigate to registration page
2. Enter valid email address
3. Enter strong password
4. Confirm password
5. Accept terms and conditions
6. Click "Register" button
7. Verify confirmation email received
8. Click verification link
9. Verify account is activated

**Expected Outcome:**
- User account is created
- Confirmation email is sent
- Email verification link works
- User can proceed to login

**Test Data:**
- Email: newuser@example.com
- Password: SecurePass@123
- Name: John Doe

---

## TEST SCENARIO 2: User Login with Valid Credentials
**Module:** Authentication  
**Priority:** High  
**Description:** Verify user can login successfully with valid email and password.

**Pre-conditions:**
- User account exists and is verified
- User is on login page
- Browser cache is cleared

**Scenario Steps:**
1. Enter registered email address
2. Enter correct password
3. Click "Login" button
4. Wait for redirection
5. Verify user dashboard loads
6. Check session token is created
7. Verify user profile is accessible

**Expected Outcome:**
- User is successfully authenticated
- Redirected to user dashboard
- Session token is stored in localStorage/cookies
- User menu displays logged-in user's name

**Test Data:**
- Email: testuser@example.com
- Password: ValidPass@123

---

## TEST SCENARIO 3: Invalid Login Attempt and Error Handling
**Module:** Authentication  
**Priority:** High  
**Description:** Verify system properly handles failed login attempts.

**Pre-conditions:**
- User account exists
- User is on login page

**Scenario Steps:**
1. Enter valid email address
2. Enter incorrect password
3. Click "Login" button
4. Observe error message
5. Attempt login again with another wrong password
6. Check if account gets locked after multiple attempts
7. Verify error messages are user-friendly

**Expected Outcome:**
- Error message "Invalid credentials" displayed
- User remains on login page
- Account lockout occurs after 5 failed attempts
- Clear error messaging without revealing if email exists

**Test Data:**
- Email: testuser@example.com
- Wrong Password: WrongPass@123

---

## TEST SCENARIO 4: Product Search and Filter Functionality
**Module:** Product Management  
**Priority:** High  
**Description:** Verify users can search and filter products effectively.

**Pre-conditions:**
- User is logged in
- Products exist in database
- User is on product listing page

**Scenario Steps:**
1. Enter search keyword in search bar
2. Press Enter or click search button
3. Verify results are filtered by keyword
4. Apply price filter (min-max)
5. Apply category filter
6. Verify results update in real-time
7. Clear filters
8. Verify all products are displayed again

**Expected Outcome:**
- Search results match keywords
- Filters work independently and together
- Results load within 2 seconds
- No broken product images
- Product count is accurate

**Test Data:**
- Search Keyword: "laptop"
- Price Range: $500-$1000
- Category: Electronics

---

## TEST SCENARIO 5: Add Products to Cart
**Module:** Shopping Cart  
**Priority:** Critical  
**Description:** Verify users can add multiple products to cart with correct quantities.

**Pre-conditions:**
- User is logged in
- Product is in stock
- User is viewing product details

**Scenario Steps:**
1. Navigate to product details page
2. Verify stock availability is shown
3. Select desired quantity (e.g., 2)
4. Click "Add to Cart" button
5. Verify cart notification appears
6. Navigate to another product
7. Add different product with quantity 1
8. View cart contents
9. Verify all products and quantities are correct

**Expected Outcome:**
- Products are added to cart
- Cart count updates in navbar
- Stock quantity decreases appropriately
- Toast notification confirms addition
- Cart persists after page refresh

**Test Data:**
- Product 1: Laptop (Qty: 2)
- Product 2: USB Cable (Qty: 1)

---

## TEST SCENARIO 6: Update Cart Quantity and Remove Items
**Module:** Shopping Cart  
**Priority:** High  
**Description:** Verify users can modify cart contents.

**Pre-conditions:**
- User has items in cart
- User is viewing cart page

**Scenario Steps:**
1. View shopping cart
2. Increase quantity of one product
3. Verify subtotal updates
4. Decrease quantity of another product
5. Remove one item from cart
6. Verify cart count updates
7. Verify total price recalculates
8. Check empty cart message if all items removed

**Expected Outcome:**
- Quantity changes reflect immediately
- Subtotal and total update in real-time
- Items are removed from cart
- Empty cart message appears when cart is empty
- Stock is released when items removed

**Test Data:**
- Modify: Laptop from 2 to 3 units
- Remove: USB Cable

---

## TEST SCENARIO 7: Checkout Process with Shipping Information
**Module:** Checkout  
**Priority:** Critical  
**Description:** Verify checkout process accepts shipping and billing information.

**Pre-conditions:**
- User has items in cart
- User is on checkout page
- User is logged in

**Scenario Steps:**
1. Review order summary
2. Enter shipping address (street, city, state, ZIP)
3. Verify address validation
4. Select shipping method (Standard/Express)
5. Verify shipping cost calculation
6. Enter billing address (same/different)
7. Verify form validation
8. Review order total
9. Proceed to payment

**Expected Outcome:**
- All address fields are required
- ZIP code format is validated
- Shipping cost is calculated correctly
- Order total is displayed accurately
- Proceed to payment button is enabled

**Test Data:**
- Street: 123 Main St
- City: New York
- State: NY
- ZIP: 10001
- Shipping Method: Express

---

## TEST SCENARIO 8: Payment Processing with Stripe
**Module:** Payment  
**Priority:** Critical  
**Description:** Verify payment processing through Stripe gateway.

**Pre-conditions:**
- User is on payment page
- Order total is displayed
- User has items in cart

**Scenario Steps:**
1. Enter payment card details (test card)
2. Enter card expiry date
3. Enter CVV code
4. Verify 3D Secure prompt appears (if applicable)
5. Click "Pay Now" button
6. Wait for payment processing
7. Verify payment success page
8. Check confirmation email
9. Verify order status is "Confirmed"

**Expected Outcome:**
- Payment is processed successfully
- Success page is displayed
- Order confirmation email is sent
- Order appears in user's order history
- Stock is deducted permanently

**Test Data:**
- Card Number: 4242 4242 4242 4242 (Stripe Test)
- Expiry: 12/25
- CVV: 123

---

## TEST SCENARIO 9: View Order History and Track Order
**Module:** Orders  
**Priority:** High  
**Description:** Verify users can view and track their orders.

**Pre-conditions:**
- User has completed at least one order
- User is logged in
- User is on MyOrders page

**Scenario Steps:**
1. Navigate to MyOrders/Order History
2. Verify all past orders are listed
3. Click on specific order
4. View order details (items, total, date)
5. Check order status (Processing/Shipped/Delivered)
6. Verify tracking information if available
7. Check estimated delivery date
8. Verify order cancellation options (if applicable)

**Expected Outcome:**
- All orders are displayed in chronological order
- Order details are complete and accurate
- Order status is current
- User can track order progress
- Correct order total is shown

**Test Data:**
- View 3 previous orders
- Check tracking status

---

## TEST SCENARIO 10: Admin Dashboard - Add New Product
**Module:** Admin Features  
**Priority:** High  
**Description:** Verify admin can add new products to inventory.

**Pre-conditions:**
- User is logged in as admin
- Admin has access to product management
- Product details are prepared

**Scenario Steps:**
1. Navigate to Admin Dashboard
2. Click "Add Product" button
3. Fill in product name
4. Enter product description
5. Upload product image(s)
6. Set product price
7. Set inventory quantity
8. Select product category
9. Add product tags
10. Click "Save Product"
11. Verify product appears in listing
12. Search for newly added product

**Expected Outcome:**
- Product is created successfully
- Product details are saved correctly
- Product image is uploaded and displayed
- Product appears in product listing
- Product is searchable
- Inventory count is accurate

**Test Data:**
- Product: Wireless Headphones
- Price: $79.99
- Stock: 50 units
- Category: Electronics
- Tags: Audio, Wireless

---

**End of Test Scenarios Document**

| Scenario # | Module | Status | Executed By | Date |
|-----------|--------|--------|-------------|------|
| TS001 | Authentication | ✓ Complete | Mukesh Kumar Reddy | Feb 4, 2026 |
| TS002 | Authentication | ✓ Complete | Mukesh Kumar Reddy | Feb 4, 2026 |
| TS003 | Authentication | ✓ Complete | Mukesh Kumar Reddy | Feb 4, 2026 |
| TS004 | Product Mgmt | ✓ Complete | Mukesh Kumar Reddy | Feb 4, 2026 |
| TS005 | Shopping Cart | ✓ Complete | Mukesh Kumar Reddy | Feb 4, 2026 |
| TS006 | Shopping Cart | ✓ Complete | Mukesh Kumar Reddy | Feb 4, 2026 |
| TS007 | Checkout | ✓ Complete | Mukesh Kumar Reddy | Feb 4, 2026 |
| TS008 | Payment | ✓ Complete | Mukesh Kumar Reddy | Feb 4, 2026 |
| TS009 | Orders | ✓ Complete | Mukesh Kumar Reddy | Feb 4, 2026 |
| TS010 | Admin Features | ✓ Complete | Mukesh Kumar Reddy | Feb 4, 2026 |
