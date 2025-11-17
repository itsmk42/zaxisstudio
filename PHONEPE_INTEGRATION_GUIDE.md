# PhonePe Payment Gateway Integration Guide for Zaxis Studio

## Overview
This guide provides step-by-step instructions to integrate PhonePe Payment Gateway with your Zaxis Studio website's checkout system. PhonePe is a leading UPI and digital payment platform in India.

---

## Part 1: Research & Understanding

### PhonePe Payment Gateway Architecture

**Official Documentation:** https://developer.phonepe.com/payment-gateway/

**Key Components:**
1. **Merchant Account** - Your PhonePe Business account
2. **API Credentials** - Merchant ID, API Key, Salt Key, Salt Index
3. **Payment Initiation** - Server-side API call to create payment order
4. **Payment Gateway** - User redirected to PhonePe's payment page
5. **Callback/Webhook** - PhonePe sends payment status to your server
6. **Verification** - Signature verification using X-VERIFY header

### Authentication Mechanism

**Required Credentials from PhonePe Business Account:**
- **Merchant ID** - Unique identifier for your business
- **API Key** - For API authentication
- **Salt Key** - For signature generation (keep secret!)
- **Salt Index** - Version of salt key (usually 1)
- **Environment** - UAT (testing) or PROD (production)

**Signature Generation:**
```
X-VERIFY = SHA256(base64(requestBody) + saltKey) + "###" + saltIndex
```

### Payment Flow

1. **Initiate Payment** (Server-side)
   - Create order with amount, merchant ID, transaction ID
   - Generate signature
   - Call PhonePe API to get payment URL
   - Return payment URL to frontend

2. **User Payment** (Client-side)
   - Redirect user to PhonePe payment page
   - User completes payment (UPI, Card, Wallet, etc.)
   - PhonePe processes payment

3. **Callback** (Server-side)
   - PhonePe sends webhook with payment status
   - Verify X-VERIFY signature
   - Update order status in database
   - Return success response

4. **Verification** (Server-side)
   - Query PhonePe API to confirm payment status
   - Update order if needed
   - Redirect user to success/failure page

### API Endpoints

**UAT (Testing):**
- Base URL: `https://api-preprod.phonepe.com/apis/hermes`
- Payment Initiation: `POST /pg/v1/pay`
- Status Check: `GET /pg/v1/status/{merchantId}/{merchantTransactionId}`

**PROD (Production):**
- Base URL: `https://api.phonepe.com/apis/hermes`
- Same endpoints as UAT

### Callback Requirements

**Webhook URL:** Must be publicly accessible HTTPS endpoint
**Method:** POST
**Headers:** 
- `X-VERIFY` - Signature for verification
- `Content-Type: application/json`

**Payload Structure:**
```json
{
  "success": true,
  "code": "PAYMENT_SUCCESS",
  "message": "Your payment was successful",
  "data": {
    "merchantId": "MERCHANT_ID",
    "merchantTransactionId": "TXN_ID",
    "transactionId": "PHONEPE_TXN_ID",
    "amount": 10000,
    "state": "COMPLETED",
    "responseCode": "SUCCESS",
    "paymentInstrument": {
      "type": "UPI",
      "utr": "123456789"
    }
  }
}
```

---

## Part 2: Integration Planning

### Architecture Overview

```
Frontend (Checkout Page)
    ↓
Backend API Route (/api/phonepe/initiate)
    ↓
PhonePe API (Payment Initiation)
    ↓
PhonePe Payment Gateway (User Payment)
    ↓
PhonePe Webhook (/api/phonepe/callback)
    ↓
Database (Order Status Update)
    ↓
Frontend (Success/Failure Page)
```

### Credentials Storage

**Environment Variables (.env.local):**
```
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_API_KEY=your_api_key
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_ENVIRONMENT=UAT  # or PROD
PHONEPE_CALLBACK_URL=https://yourdomain.com/api/phonepe/callback
```

### Database Schema Updates

**Orders Table - Add Columns:**
- `phonepe_transaction_id` - PhonePe transaction ID
- `payment_status` - PENDING, SUCCESS, FAILED
- `payment_response` - Full callback response (JSON)

---

## Part 3: Implementation Steps

### Step 1: Install PhonePe SDK

```bash
npm install https://phonepe.mycloudrepo.io/public/repositories/phonepe-pg-sdk-node/releases/v2/phonepe-pg-sdk-node.tgz
npm install crypto uuid
```

### Step 2: Create API Routes

**Files to create:**
- `app/api/phonepe/initiate/route.js` - Payment initiation
- `app/api/phonepe/callback/route.js` - Webhook handler
- `app/api/phonepe/status/route.js` - Status check
- `lib/phonepe.js` - PhonePe utility functions

### Step 3: Update Checkout Component

**File:** `components/CheckoutClientNew.jsx`
- Add PhonePe payment handler
- Redirect to payment URL on PhonePe selection
- Handle success/failure responses

### Step 4: Update Order Management

**File:** `components/admin/OrderDetailsClient.jsx`
- Display payment status
- Show PhonePe transaction ID
- Display payment response details

---

## Part 4: Security Considerations

✅ **Store credentials in environment variables**
✅ **Verify X-VERIFY signature on all callbacks**
✅ **Validate amount matches order total**
✅ **Use HTTPS for all endpoints**
✅ **Implement rate limiting on webhook**
✅ **Log all payment transactions**
✅ **Never expose API keys in frontend code**
✅ **Implement idempotency for webhook handling**

---

## Part 5: Testing Checklist

- [ ] Test payment initiation with UAT credentials
- [ ] Test successful payment flow
- [ ] Test failed payment handling
- [ ] Test webhook callback verification
- [ ] Test status check API
- [ ] Test order status updates
- [ ] Test error handling and user feedback
- [ ] Test mobile responsiveness
- [ ] Load test webhook endpoint
- [ ] Verify all logs are recorded

---

## Next Steps

1. Gather credentials from PhonePe Business account
2. Set up environment variables
3. Implement API routes (see Part 3 Implementation)
4. Update checkout component
5. Test in UAT environment
6. Deploy to production

---

## Support & Resources

- **PhonePe Developer Docs:** https://developer.phonepe.com/payment-gateway/
- **PhonePe Business:** https://business.phonepe.com/
- **API Reference:** https://developer.phonepe.com/payment-gateway/backend-sdk/nodejs-be-sdk/api-reference-node-js/
- **Webhook Docs:** https://developer.phonepe.com/payment-gateway/autopay/webhook


