# PhonePe Integration - Quick Start Guide

## 🚀 5-Minute Setup

### 1. Get Your Credentials
```
Login to: https://business.phonepe.com/
Settings → Developer Settings → API Keys
Copy: Merchant ID, API Key, Salt Key
```

### 2. Add Environment Variables
Create/update `.env.local`:
```env
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_API_KEY=your_api_key
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_ENVIRONMENT=UAT
PHONEPE_CALLBACK_URL=https://yourdomain.com/api/phonepe/callback
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Update Database
Run this SQL:
```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS phonepe_transaction_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'PENDING';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_response JSONB;
```

### 4. Install Dependencies
```bash
npm install uuid
```

### 5. Files Already Created
✅ `lib/phonepe.js` - Core utilities
✅ `app/api/phonepe/initiate/route.js` - Payment initiation
✅ `app/api/phonepe/callback/route.js` - Webhook handler
✅ `app/api/phonepe/status/route.js` - Status check

---

## 📝 Update CheckoutClientNew.jsx

In the `placeOrder()` function, add this for PhonePe:

```javascript
if (form.payment_method === 'phonepe') {
  try {
    setIsLoading(true);
    setStatus('Initiating PhonePe payment...');

    const response = await fetch('/api/phonepe/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: orderResponse.id,
        amount: total,
        customerEmail: form.email,
        customerPhone: form.phone,
        customerName: form.name,
      }),
    });

    const paymentData = await response.json();

    if (paymentData.success && paymentData.redirectUrl) {
      window.location.href = paymentData.redirectUrl;
    } else {
      setStatus(`Payment failed: ${paymentData.error}`);
      setIsLoading(false);
    }
  } catch (error) {
    setStatus(`Error: ${error.message}`);
    setIsLoading(false);
  }
}
```

---

## 🎯 Create Payment Status Page

Create `app/checkout/payment-status/page.jsx`:

```javascript
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const txn = searchParams.get('txn');
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Checking payment status...');

  useEffect(() => {
    if (!txn) return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/phonepe/status?transactionId=${txn}`);
        const data = await response.json();

        if (data.paymentStatus === 'SUCCESS') {
          setStatus('success');
          setMessage('Payment successful! Your order has been confirmed.');
        } else if (data.paymentStatus === 'FAILED') {
          setStatus('failed');
          setMessage('Payment failed. Please try again.');
        } else {
          setStatus('pending');
          setMessage('Payment is being processed...');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Error checking payment status.');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [txn]);

  return (
    <div className="container" style={{ textAlign: 'center', padding: '60px 16px' }}>
      <h1>Payment Status</h1>
      <p>{message}</p>
      {status === 'success' && (
        <a href="/orders" className="btn primary">View Orders</a>
      )}
      {status === 'failed' && (
        <a href="/checkout" className="btn primary">Try Again</a>
      )}
    </div>
  );
}
```

---

## 🧪 Testing Checklist

- [ ] Test payment initiation (should redirect to PhonePe)
- [ ] Test successful payment (should update order status)
- [ ] Test failed payment (should show error)
- [ ] Test webhook callback (check database updates)
- [ ] Test status check API (should return correct status)
- [ ] Test on mobile (responsive design)

---

## 🔐 Security Checklist

- [ ] Never commit `.env.local` to Git
- [ ] Add `.env.local` to `.gitignore`
- [ ] Use strong salt keys
- [ ] Verify X-VERIFY signatures (already implemented)
- [ ] Use HTTPS for callback URL
- [ ] Rotate credentials periodically

---

## 📊 API Endpoints Reference

### Initiate Payment
```
POST /api/phonepe/initiate
Body: { orderId, amount, customerEmail, customerPhone, customerName }
Response: { success, redirectUrl, merchantTransactionId }
```

### Webhook Callback
```
POST /api/phonepe/callback
Headers: X-VERIFY (signature)
Body: PhonePe callback data
Response: { success, code, message }
```

### Check Status
```
GET /api/phonepe/status?transactionId=xxx&orderId=yyy
Response: { success, paymentStatus, amount, transactionId }
```

---

## 🐛 Troubleshooting

**Payment not initiating?**
- Check environment variables are set
- Verify merchant ID is correct
- Check network tab for API errors

**Callback not received?**
- Verify callback URL is publicly accessible
- Check firewall/security groups
- Ensure HTTPS is enabled
- Check PhonePe webhook logs

**Order status not updating?**
- Check database connection
- Verify order ID exists
- Check for database errors in logs

---

## 📚 Full Documentation

- `PHONEPE_INTEGRATION_GUIDE.md` - Complete research & architecture
- `PHONEPE_IMPLEMENTATION_STEPS.md` - Detailed implementation guide
- `PHONEPE_INTEGRATION_SUMMARY.md` - Complete summary with all details

---

## ✅ You're Ready!

All code is created and ready to use. Just:
1. Add credentials to `.env.local`
2. Update database schema
3. Update `CheckoutClientNew.jsx`
4. Create payment status page
5. Test and deploy!

**Questions?** Check the full documentation files or PhonePe docs: https://developer.phonepe.com/payment-gateway/


