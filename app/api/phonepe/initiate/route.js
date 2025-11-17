import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { initiatePayment, validateConfig } from '../../../lib/phonepe';
import { supabaseServer } from '../../../lib/supabaseServer';

/**
 * POST /api/phonepe/initiate
 * Initiates a PhonePe payment for an order
 * 
 * Request body:
 * {
 *   orderId: string,
 *   amount: number,
 *   customerEmail: string,
 *   customerPhone: string,
 *   customerName: string
 * }
 */
export async function POST(req) {
  try {
    // Validate PhonePe configuration
    if (!validateConfig()) {
      return NextResponse.json(
        { error: 'PhonePe configuration is incomplete' },
        { status: 500 }
      );
    }

    const { orderId, amount, customerEmail, customerPhone, customerName } = await req.json();

    // Validate required fields
    if (!orderId || !amount || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, amount, customerPhone' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Generate unique transaction ID
    const merchantTransactionId = `${orderId}_${Date.now()}_${uuidv4().slice(0, 8)}`;

    // Get the origin for redirect URL
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://zaxisstudio.com';
    const redirectUrl = `${origin}/checkout/payment-status?txn=${merchantTransactionId}`;
    const callbackUrl = `${origin}/api/phonepe/callback`;

    // Initiate payment with PhonePe
    const paymentResult = await initiatePayment({
      merchantTransactionId,
      amount,
      redirectUrl,
      callbackUrl,
      userPhone: customerPhone,
      userName: customerName,
    });

    if (!paymentResult.success) {
      console.error('PhonePe payment initiation failed:', paymentResult.error);
      return NextResponse.json(
        { error: paymentResult.error || 'Failed to initiate payment' },
        { status: 400 }
      );
    }

    // Store transaction details in database
    try {
      const { error: dbError } = await supabaseServer()
        .from('orders')
        .update({
          phonepe_transaction_id: merchantTransactionId,
          payment_status: 'PENDING',
        })
        .eq('id', orderId);

      if (dbError) {
        console.error('Database update error:', dbError);
        // Continue anyway - payment is initiated
      }
    } catch (dbErr) {
      console.error('Database error:', dbErr);
      // Continue anyway - payment is initiated
    }

    return NextResponse.json({
      success: true,
      redirectUrl: paymentResult.redirectUrl,
      merchantTransactionId,
      message: 'Payment initiated successfully',
    });
  } catch (error) {
    console.error('PhonePe initiate error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

