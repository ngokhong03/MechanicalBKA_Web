import PayOS from '@payos/node';
import admin from './firebase-admin.js';

export default async function handler(req, res) {
  // Bật CORS cho API
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    if (!process.env.PAYOS_CLIENT_ID || !process.env.PAYOS_API_KEY || !process.env.PAYOS_CHECKSUM_KEY) {
      return res.status(500).json({ error: 'PayOS credentials are not configured on server' });
    }

    // Initialize PayOS
    const payos = new PayOS(
      process.env.PAYOS_CLIENT_ID,
      process.env.PAYOS_API_KEY,
      process.env.PAYOS_CHECKSUM_KEY
    );

    // Fetch order from Firestore
    const db = admin.firestore();
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = orderDoc.data();

    // Prevent re-creating link if already paid
    if (orderData.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Order is already paid' });
    }

    // PayOS requires orderCode to be a Number (max 53 bits).
    // Let's create a unique numeric code for this order if not exists.
    let payosOrderCode = orderData.payosOrderCode;
    if (!payosOrderCode) {
      // e.g. 1712345678 (10 digits) + random 4 digits = 14 digits max
      payosOrderCode = Number(String(Date.now()).slice(-10) + Math.floor(1000 + Math.random() * 9000));
      await orderRef.update({ payosOrderCode });
    }

    // Get the base URL (Vercel provides VERCEL_URL, or we use a static fallback)
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = req.headers.host || process.env.VERCEL_URL || 'mechanicalbka-web.vercel.app';
    const domain = `${protocol}://${host}`;

    const body = {
      orderCode: payosOrderCode,
      amount: orderData.totalAmount,
      description: `Thanh toan MBKA`,
      items: [
        {
          name: orderData.items[0]?.snapshotTitle || 'Sản phẩm MechanicalBKA',
          quantity: 1,
          price: orderData.totalAmount
        }
      ],
      returnUrl: `${domain}/account`, // Chuyển hướng khách sau khi thanh toán thành công
      cancelUrl: `${domain}/account`
    };

    const paymentLinkRes = await payos.createPaymentLink(body);

    return res.status(200).json({ 
      success: true, 
      checkoutUrl: paymentLinkRes.checkoutUrl,
      payosOrderCode
    });

  } catch (error) {
    console.error('Error creating payment link:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
