import { NextResponse } from 'next/server';
import { checkPaymentStatus } from '../../../lib/phonepe';
import { supabaseServer } from '../../../lib/supabaseServer';

/**
 * GET /api/phonepe/status?transactionId=xxx
 * Check payment status with PhonePe
 * 
 * Query parameters:
 * - transactionId: Merchant transaction ID
 * - orderId: Order ID (optional, for database update)
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const merchantTransactionId = searchParams.get('transactionId');
    const orderId = searchParams.get('orderId');

    if (!merchantTransactionId) {
      return NextResponse.json(
        { error: 'transactionId is required' },
        { status: 400 }
      );
    }

    // Check payment status with PhonePe
    const statusResult = await checkPaymentStatus(merchantTransactionId);

    if (!statusResult.success) {
      return NextResponse.json(
        { error: statusResult.error || 'Failed to check payment status' },
        { status: 400 }
      );
    }

    // Extract payment status
    const paymentData = statusResult.data || {};
    const paymentStatus = paymentData.state === 'COMPLETED' && paymentData.responseCode === 'SUCCESS' 
      ? 'SUCCESS' 
      : paymentData.state === 'FAILED' 
      ? 'FAILED' 
      : 'PENDING';

    // Update order if orderId is provided
    if (orderId && paymentStatus !== 'PENDING') {
      try {
        await supabaseServer()
          .from('orders')
          .update({
            payment_status: paymentStatus,
            status: paymentStatus === 'SUCCESS' ? 'confirmed' : 'pending',
            payment_response: statusResult,
          })
          .eq('id', orderId);
      } catch (dbError) {
        console.error('Database update error:', dbError);
        // Continue - status check is still valid
      }
    }

    return NextResponse.json({
      success: true,
      merchantTransactionId,
      paymentStatus,
      amount: paymentData.amount ? paymentData.amount / 100 : 0,
      transactionId: paymentData.transactionId,
      state: paymentData.state,
      responseCode: paymentData.responseCode,
      paymentInstrument: paymentData.paymentInstrument,
    });
  } catch (error) {
    console.error('PhonePe status check error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

