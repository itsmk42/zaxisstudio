# PhonePe Payment Gateway - Implementation Steps

## Step 1: Get PhonePe Credentials

### From Your PhonePe Business Account:

1. **Login to PhonePe Business:** https://business.phonepe.com/
2. **Navigate to Developer Settings:**
   - Go to Settings → Developer Settings → API Keys
3. **Copy These Credentials:**
   - Merchant ID
   - API Key
   - Salt Key (keep this secret!)
   - Salt Index (usually 1)

### For Testing (UAT):
- Use test credentials provided by PhonePe
- Test Merchant ID usually starts with "test"
- Use UAT environment in configuration

---

## Step 2: Set Up Environment Variables

### Create/Update `.env.local`:

```env
# PhonePe Payment Gateway Configuration
PHONEPE_MERCHANT_ID=your_merchant_id_here
PHONEPE_API_KEY=your_api_key_here
PHONEPE_SALT_KEY=your_salt_key_here
PHONEPE_SALT_INDEX=1
PHONEPE_ENVIRONMENT=UAT  # Change to PROD for production
PHONEPE_CALLBACK_URL=https://yourdomain.com/api/phonepe/callback
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Important Security Notes:
- ✅ Never commit `.env.local` to Git
- ✅ Add `.env.local` to `.gitignore`
- ✅ Use strong, unique salt keys
- ✅ Rotate credentials periodically
- ✅ Use different credentials for UAT and PROD

---

## Step 3: Install Dependencies

```bash
npm install uuid
# PhonePe SDK is already included in lib/phonepe.js
```

---

## Step 4: Update Database Schema

### Add columns to `orders` table:

```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS phonepe_transaction_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'PENDING';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_response JSONB;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_phonepe_txn ON orders(phonepe_transaction_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
```

---

## Step 5: Update Checkout Component

### Modify `components/CheckoutClientNew.jsx`:

Add PhonePe payment handler in the payment submission:

```javascript
// In the placeOrder function, add:
if (form.payment_method === 'phonepe') {
  try {
    setIsLoading(true);
    setStatus('Initiating PhonePe payment...');

    // Call payment initiation API
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
      // Redirect to PhonePe payment page
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

## Step 6: Create Payment Status Page

### Create `app/checkout/payment-status/page.jsx`:

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

## Step 7: Testing Checklist

### UAT Testing:
- [ ] Test payment initiation
- [ ] Test successful payment flow
- [ ] Test failed payment handling
- [ ] Test webhook callback
- [ ] Test status check API
- [ ] Test order status updates
- [ ] Test error messages
- [ ] Test mobile responsiveness

### Before Production:
- [ ] Switch to PROD credentials
- [ ] Update PHONEPE_ENVIRONMENT to PROD
- [ ] Test with real payments
- [ ] Verify webhook is working
- [ ] Check all logs
- [ ] Load test the endpoints

---

## Step 8: Monitoring & Logging

### Add logging to track payments:

```javascript
// In lib/phonepe.js or API routes
console.log('PhonePe Payment Event:', {
  timestamp: new Date().toISOString(),
  event: 'payment_initiated|callback_received|status_checked',
  merchantTransactionId,
  amount,
  status,
});
```

### Monitor these metrics:
- Payment success rate
- Average payment time
- Callback delivery time
- Error rates
- Failed transactions

---

## Troubleshooting

### Common Issues:

**1. "Invalid X-VERIFY signature"**
- Check salt key is correct
- Verify salt index matches
- Ensure payload encoding is correct

**2. "Merchant ID not found"**
- Verify PHONEPE_MERCHANT_ID is correct
- Check environment (UAT vs PROD)

**3. "Callback not received"**
- Verify callback URL is publicly accessible
- Check firewall/security groups
- Ensure HTTPS is enabled
- Check PhonePe webhook logs

**4. "Payment status not updating"**
- Check database connection
- Verify order ID exists
- Check for database errors in logs

---

## Support

- **PhonePe Docs:** https://developer.phonepe.com/payment-gateway/
- **API Reference:** https://developer.phonepe.com/payment-gateway/backend-sdk/nodejs-be-sdk/api-reference-node-js/
- **Contact PhonePe:** support@phonepe.com


