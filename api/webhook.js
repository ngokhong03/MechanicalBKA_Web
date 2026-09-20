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
    const webhookData = req.body;

    if (!process.env.PAYOS_CLIENT_ID || !process.env.PAYOS_API_KEY || !process.env.PAYOS_CHECKSUM_KEY) {
      console.error('Missing PayOS credentials');
      return res.status(500).json({ error: 'PayOS credentials are not configured' });
    }

    const payos = new PayOS(
      process.env.PAYOS_CLIENT_ID,
      process.env.PAYOS_API_KEY,
      process.env.PAYOS_CHECKSUM_KEY
    );

    // Xác thực Webhook Signature
    try {
      payos.verifyPaymentWebhookData(webhookData);
    } catch (err) {
      console.error('PayOS Webhook Signature verification failed:', err);
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    // webhookData.data chứa thông tin giao dịch
    const { orderCode, amount, description } = webhookData.data;
    if (!orderCode) {
      return res.status(400).json({ error: 'Missing orderCode in webhook' });
    }

    console.log(`Received webhook for orderCode: ${orderCode}, amount: ${amount}`);

    const db = admin.firestore();
    
    // Tìm đơn hàng bằng payosOrderCode
    const ordersRef = db.collection('orders');
    const snapshot = await ordersRef.where('payosOrderCode', '==', Number(orderCode)).get();

    if (snapshot.empty) {
      console.warn(`Order with payosOrderCode ${orderCode} not found in Firestore`);
      return res.status(404).json({ error: 'Order not found' });
    }

    // Có thể có nhiều đơn nếu lỗi, lấy đơn đầu tiên
    const orderDoc = snapshot.docs[0];
    const orderData = orderDoc.data();
    const orderId = orderDoc.id;

    // Kiểm tra số tiền chuyển
    if (amount < orderData.totalAmount) {
      console.warn(`Insufficient amount for order ${orderId}. Expected ${orderData.totalAmount}, got ${amount}`);
      // Ở hệ thống thực tế có thể cập nhật trạng thái "partial_paid". Ở đây tạm bỏ qua không duyệt.
      return res.status(400).json({ error: 'Insufficient amount transferred' });
    }

    if (orderData.paymentStatus === 'paid') {
      console.log(`Order ${orderId} is already paid. Ignoring webhook.`);
      return res.status(200).json({ success: true, message: 'Already paid' });
    }

    // Cập nhật trạng thái đơn hàng
    const timestamp = new Date().toISOString();
    await orderDoc.ref.update({
      paymentStatus: 'paid',
      orderStatus: 'completed',
      updatedAt: timestamp,
      paymentWebhookData: webhookData.data // Lưu lại dữ liệu giao dịch làm bằng chứng
    });

    console.log(`Order ${orderId} marked as paid.`);

    // Tự động cấp phát Entitlements
    const { userId, items } = orderData;
    if (userId && Array.isArray(items)) {
      const entitlementsRef = db.collection('entitlements');
      const batch = db.batch();

      for (const item of items) {
        const { targetType, targetId } = item;
        if (!targetType || !targetId) continue;

        // Tạo deterministic ID
        const entitlementId = `${userId}_${targetType}_${targetId}`;
        const entRef = entitlementsRef.doc(entitlementId);

        batch.set(entRef, {
          id: entitlementId,
          userId,
          targetType,
          targetId,
          sourceOrderId: orderId,
          grantedAt: timestamp,
          status: 'active'
        }, { merge: true });
      }

      await batch.commit();
      console.log(`Granted entitlements for order ${orderId}`);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
