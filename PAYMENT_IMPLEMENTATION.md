# CareerCraft Payment Implementation Guide

## ✅ What's Done

### Frontend (React)
- ✅ Razorpay script loaded in `index.html`
- ✅ Updated `src/components/Pricing.jsx` with proper payment flow:
  - Click handler on "Sign In & Pay ₹199" button
  - Calls `POST /create-order` to backend
  - Opens Razorpay checkout modal
  - Shows loading state during checkout
  - Displays error messages if checkout fails

### Backend (Cloudflare Workers)
- ✅ `/create-order` endpoint implemented in `backend/src/routes/createOrder.ts`:
  - Rate limiting (5 requests per minute per IP)
  - Creates Razorpay order for ₹199
  - Returns CORS-enabled response
- ✅ `/payment-webhook` endpoint for Razorpay webhook notifications
- ✅ CORS configuration to allow requests from landing page

---

## 🔧 What Needs Configuration

### 1. Environment Variables (REQUIRED BEFORE DEPLOY)

**Landing Page (.env.local or CI/CD secrets):**
```bash
VITE_BACKEND_URL=https://careercraft.webelvate.com/api
```

Replace `careercraft.webelvate.com/api` with your actual deployed backend URL.

**Backend (wrangler.toml secrets):**
```bash
wrangler secret put RAZORPAY_KEY_ID
wrangler secret put RAZORPAY_KEY_SECRET
```

Get these from https://dashboard.razorpay.com/ → Settings → API Keys

### 2. Deploy Sequence

**Step 1: Deploy Backend First**
```bash
cd backend
wrangler login
wrangler secret put RAZORPAY_KEY_ID      # test mode key
wrangler secret put RAZORPAY_KEY_SECRET  # test mode key
wrangler secret put DATABASE_URL
wrangler secret put EMAIL_API_KEY
wrangler secret put LLM_API_KEY
wrangler secret put ADMIN_PASSWORD
wrangler secret put EXTENSION_ORIGIN     # e.g., chrome-extension://xxxxx
wrangler secret put CHECKOUT_ORIGIN      # e.g., https://careercraftt.webelvate.com
npx wrangler deploy
```

Note the deployed URL (e.g., `https://careercraft-backend.worker.dev`)

**Step 2: Deploy Landing Page**
```bash
# Update VITE_BACKEND_URL to match deployed backend
VITE_BACKEND_URL=https://careercraft-backend.worker.dev \
npm run build

# Deploy to Cloudflare Pages, Netlify, or your hosting
```

### 3. Razorpay Webhook Configuration (CRITICAL)

After deploying backend, configure Razorpay to notify you of payments:

1. Go to https://dashboard.razorpay.com/ → Settings → Webhooks
2. Create new webhook:
   - **URL**: `https://[your-backend-url]/payment-webhook`
   - **Events**: Select `order.paid`
   - **Secret**: Any secure string (set as `RAZORPAY_WEBHOOK_SECRET`)

```bash
wrangler secret put RAZORPAY_WEBHOOK_SECRET "your_webhook_secret_here"
npx wrangler deploy
```

---

## 🧪 Testing the Flow (TEST MODE)

### Test Mode Setup
1. Create Razorpay test account at https://dashboard.razorpay.com
2. Generate test keys (clearly marked "Test Mode" in dashboard)
3. Use these keys in development:
   ```bash
   wrangler secret put RAZORPAY_KEY_ID "rzp_test_xxxxxxxxxxxx"
   wrangler secret put RAZORPAY_KEY_SECRET "test_secret_xxxxxxxxxxxx"
   ```

### Test Payment Flow
1. Local development:
   ```bash
   npm run dev              # Landing page (port 5173)
   wrangler dev backend     # Backend (port 8787)
   ```
   Update `VITE_BACKEND_URL=http://localhost:8787` locally

2. Click "Sign In & Pay ₹199" → Razorpay modal opens
3. Use test card: **4111 1111 1111 1111** (any future expiry, any CVV)
4. Payment should succeed and show in Razorpay dashboard

### Verify Webhook
1. Check backend logs for webhook receipt
2. Verify license key was created in database
3. Verify confirmation email was sent (if EMAIL_API_KEY configured)

---

## 📋 Post-Payment Flow (NOT YET IMPLEMENTED)

The payment is successful, but the following still need implementation per TODO.md:

1. **Sign-In System** — Currently the flow skips authentication
   - Implement OAuth/sign-in before checkout
   - Tie license key to user account
   - Store user's LinkedIn profile data

2. **License Key Email** — After webhook receipt
   - Generate license key after payment
   - Email key to customer
   - Extension validates key before accessing LinkedIn

3. **License Binding** — In extension
   - Extension reads license key from user
   - Validates key against backend
   - Only activates if key is valid and tied to user's LinkedIn account

---

## 🚨 Known Limitations (As of Sept 18, 2026)

1. **No Sign-In** — Anyone can click "Pay" without creating an account
2. **No License Validation** — Payment completes but no key generated
3. **No Email Delivery** — Confirmation email not sent after payment
4. **No Terms/Privacy Pages** — Links still point to `#`
5. **No Admin Panel** — No way to manage payments or issue refunds

---

## 🔗 Key Files to Review

| File | Purpose | Status |
|---|---|---|
| `src/components/Pricing.jsx` | Payment button + checkout flow | ✅ Updated |
| `backend/src/routes/createOrder.ts` | Create Razorpay order | ✅ Ready |
| `backend/src/routes/paymentWebhook.ts` | Handle payment confirmation | ✅ Ready |
| `index.html` | Razorpay script loading | ✅ Ready |
| `.env` (not in repo) | Backend URL config | 🔧 Needs setup |
| `wrangler.toml` | Secrets configuration | 🔧 Needs secrets |

---

## 💡 Next Steps (Priority Order)

1. **Deploy backend** with test keys → get deployed URL
2. **Configure environment** in landing page build
3. **Test full payment flow** in test mode
4. **Register Razorpay webhook** → validate receipt
5. **Implement sign-in** before checkout
6. **Generate & email license keys** after payment
7. **Create Terms & Privacy pages**
8. **Switch to live Razorpay keys** when ready for real payments

---

## ⚠️ Security Checklist Before Live

- [ ] Switch to Razorpay **live keys** (not test keys)
- [ ] Verify webhook secret is strong
- [ ] Enable HTTPS everywhere
- [ ] Add sign-in requirement before checkout
- [ ] Validate license keys in extension before accessing LinkedIn
- [ ] Review payment failure handling
- [ ] Set up monitoring/alerting for failed webhooks
- [ ] Test refund flow if implementing
- [ ] Create legal Terms & Privacy Policy pages

