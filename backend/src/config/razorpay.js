import Razorpay from 'razorpay';

function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_SECRET;
  return { keyId: typeof keyId === 'string' ? keyId.trim() : '', keySecret: typeof keySecret === 'string' ? keySecret.trim() : '' };
}

const { keyId, keySecret } = getRazorpayConfig();

const razorpay = keyId && keySecret
  ? new Razorpay({ key_id: keyId, key_secret: keySecret })
  : null;

export default razorpay;
export { getRazorpayConfig };
