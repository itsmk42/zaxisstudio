import { NextResponse } from 'next/server';
import { verifyXVerify, processCallback } from '../../../lib/phonepe';
import { supabaseServer } from '../../../lib/supabaseServer';

/**
 * POST /api/phonepe/callback
 * Webhook endpoint for PhonePe payment callbacks
 * 
 * PhonePe sends payment status updates to this endpoint
 * Signature verification is performed using X-VERIFY header
 */
export async function POST(req) {
  try {
    // Get request body as text for signature verification
    const bodyText = await req.text();
    const xVerify = req.headers.get('x-verify');

    // Verify X-VERIFY signature
    if (!xVerify || !verifyXVerify(bodyText, xVerify)) {
      console.error('Invalid X-VERIFY signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse callback data
    let callbackData;
    try {
      callbackData = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('Failed to parse callback body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    // Process callback
    const processedData = processCallback(callbackData);
    const { merchantTransactionId, phonepeTransactionId, amount, state, responseCode } = processedData;

    // Determine payment status
    const paymentStatus = state === 'COMPLETED' && responseCode === 'SUCCESS' ? 'SUCCESS' : 'FAILED';

    // Extract order ID from merchant transaction ID
    const orderId = merchantTransactionId.split('_')[0];

    // Update order in database
    try {
      const { error: updateError } = await supabaseServer()
        .from('orders')
        .update({
          payment_status: paymentStatus,
          phonepe_transaction_id: phonepeTransactionId,
          payment_response: callbackData,
          status: paymentStatus === 'SUCCESS' ? 'confirmed' : 'pending',
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Database update error:', updateError);
        // Still return success to PhonePe to prevent retries
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Still return success to PhonePe to prevent retries
    }

    // Log transaction
    console.log('PhonePe Callback Processed:', {
      orderId,
      merchantTransactionId,
      phonepeTransactionId,
      amount,
      status: paymentStatus,
      timestamp: new Date().toISOString(),
    });

    // Return success response to PhonePe
    return NextResponse.json({
      success: true,
      code: 'CALLBACK_RECEIVED',
      message: 'Callback processed successfully',
    });
  } catch (error) {
    console.error('PhonePe callback error:', error);
    
    // Return success to prevent PhonePe from retrying
    // (We've logged the error for manual investigation)
    return NextResponse.json({
      success: true,
      code: 'CALLBACK_RECEIVED',
      message: 'Callback received',
    });
  }
}

/**
 * GET /api/phonepe/callback
 * Health check endpoint
 */
export async function GET(req) {
  return NextResponse.json({
    status: 'ok',
    message: 'PhonePe callback endpoint is active',
  });
}

