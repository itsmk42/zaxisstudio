import crypto from 'crypto';

/**
 * PhonePe Payment Gateway Utility Functions
 * Handles payment initiation, verification, and callback processing
 */

const PHONEPE_CONFIG = {
  merchantId: process.env.PHONEPE_MERCHANT_ID,
  apiKey: process.env.PHONEPE_API_KEY,
  saltKey: process.env.PHONEPE_SALT_KEY,
  saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
  environment: process.env.PHONEPE_ENVIRONMENT || 'UAT',
  callbackUrl: process.env.PHONEPE_CALLBACK_URL,
};

// API Base URLs
const API_URLS = {
  UAT: 'https://api-preprod.phonepe.com/apis/hermes',
  PROD: 'https://api.phonepe.com/apis/hermes',
};

/**
 * Generate X-VERIFY signature for PhonePe API requests
 * @param {string} payload - Base64 encoded request body
 * @returns {string} X-VERIFY header value
 */
export function generateXVerify(payload) {
  const hash = crypto
    .createHash('sha256')
    .update(payload + PHONEPE_CONFIG.saltKey)
    .digest('hex');
  return `${hash}###${PHONEPE_CONFIG.saltIndex}`;
}

/**
 * Verify X-VERIFY signature from PhonePe callback
 * @param {string} payload - Response body as string
 * @param {string} xVerify - X-VERIFY header from callback
 * @returns {boolean} True if signature is valid
 */
export function verifyXVerify(payload, xVerify) {
  const [receivedHash, receivedIndex] = xVerify.split('###');
  
  // Verify salt index matches
  if (receivedIndex !== PHONEPE_CONFIG.saltIndex) {
    console.error('Salt index mismatch');
    return false;
  }

  // Generate expected hash
  const expectedHash = crypto
    .createHash('sha256')
    .update(payload + PHONEPE_CONFIG.saltKey)
    .digest('hex');

  // Compare hashes
  return receivedHash === expectedHash;
}

/**
 * Initiate payment with PhonePe
 * @param {Object} orderData - Order details
 * @returns {Promise<Object>} Payment URL and transaction details
 */
export async function initiatePayment(orderData) {
  const {
    merchantTransactionId,
    amount,
    redirectUrl,
    callbackUrl,
    userPhone,
    userName,
  } = orderData;

  // Prepare request payload
  const requestPayload = {
    merchantId: PHONEPE_CONFIG.merchantId,
    merchantTransactionId,
    merchantUserId: userPhone || 'user_' + Date.now(),
    amount: Math.round(amount * 100), // Convert to paise
    redirectUrl,
    callbackUrl: callbackUrl || PHONEPE_CONFIG.callbackUrl,
    mobileNumber: userPhone,
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
  };

  // Encode payload
  const base64Payload = Buffer.from(JSON.stringify(requestPayload)).toString('base64');
  const xVerify = generateXVerify(base64Payload);

  try {
    const apiUrl = `${API_URLS[PHONEPE_CONFIG.environment]}/pg/v1/pay`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId,
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    });

    const data = await response.json();

    if (data.success && data.data?.instrumentResponse?.redirectUrl) {
      return {
        success: true,
        redirectUrl: data.data.instrumentResponse.redirectUrl,
        transactionId: merchantTransactionId,
      };
    } else {
      return {
        success: false,
        error: data.message || 'Payment initiation failed',
      };
    }
  } catch (error) {
    console.error('PhonePe payment initiation error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Check payment status with PhonePe
 * @param {string} merchantTransactionId - Transaction ID
 * @returns {Promise<Object>} Payment status
 */
export async function checkPaymentStatus(merchantTransactionId) {
  const xVerify = generateXVerify('');

  try {
    const apiUrl = `${API_URLS[PHONEPE_CONFIG.environment]}/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${merchantTransactionId}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('PhonePe status check error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Process PhonePe callback
 * @param {Object} callbackData - Callback data from PhonePe
 * @returns {Object} Processed callback response
 */
export function processCallback(callbackData) {
  const { success, code, message, data } = callbackData;

  return {
    success,
    code,
    message,
    merchantTransactionId: data?.merchantTransactionId,
    phonepeTransactionId: data?.transactionId,
    amount: data?.amount ? data.amount / 100 : 0, // Convert from paise
    state: data?.state,
    responseCode: data?.responseCode,
    paymentInstrument: data?.paymentInstrument,
  };
}

/**
 * Validate PhonePe configuration
 * @returns {boolean} True if all required config is present
 */
export function validateConfig() {
  const required = ['merchantId', 'apiKey', 'saltKey', 'callbackUrl'];
  const missing = required.filter(key => !PHONEPE_CONFIG[key]);
  
  if (missing.length > 0) {
    console.error('Missing PhonePe configuration:', missing);
    return false;
  }
  
  return true;
}

export default {
  generateXVerify,
  verifyXVerify,
  initiatePayment,
  checkPaymentStatus,
  processCallback,
  validateConfig,
};

