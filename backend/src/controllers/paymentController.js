import razorpay, { getRazorpayConfig } from '../config/razorpay.js';

/**
 * POST /api/payment/create-order
 * Create a Razorpay order. Body: { amount } (amount in INR).
 * Returns Razorpay order { id, amount, currency, ... } or { error }.
 */
export const createOrder = async (req, res) => {
  try {
    const { keyId } = getRazorpayConfig();
    if (!keyId || !razorpay) {
      return res.status(500).json({
        error: 'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_SECRET in .env',
      });
    }

    const amount = Number(req.body?.amount);
    if (!Number.isFinite(amount) || amount < 1) {
      return res.status(400).json({ error: 'amount (number, in INR) is required' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    return res.json(order);
  } catch (error) {
    const message = error?.message || 'Failed to create order';
    console.error('Payment create-order error:', error);
    return res.status(500).json({ error: message });
  }
};
