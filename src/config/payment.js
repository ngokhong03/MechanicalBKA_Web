/**
 * MechanicalBKA — Payment & Banking Configuration
 * Cấu hình thông tin tài khoản nhận chuyển khoản và tiện ích VietQR
 */

export const paymentConfig = {
  bankId: import.meta.env.VITE_BANK_ID || 'MB', // Mã ngân hàng VietQR (MB, VCB, TCB, ICB, ACB...)
  bankName: import.meta.env.VITE_BANK_NAME || 'Ngân hàng Quân Đội (MB Bank)',
  accountNumber: import.meta.env.VITE_BANK_ACCOUNT_NO || '0862990403',
  accountName: import.meta.env.VITE_BANK_ACCOUNT_NAME || 'NGUYEN NGOC TRONG',
  branch: import.meta.env.VITE_BANK_BRANCH || 'Chi nhánh Hà Nội',
  
  // Tiền tố nội dung chuyển khoản

  transferPrefix: 'MBKA'
};

/**
 * Tạo URL VietQR tiêu chuẩn
 * @param {number} amount - Số tiền cần thanh toán
 * @param {string} orderId - Mã đơn hàng
 * @returns {string} URL hình ảnh QR Code
 */
export const generateVietQRUrl = (amount, orderId) => {
  const cleanOrderId = (orderId || '').replace(/[^a-zA-Z0-9]/g, '');
  const transferContent = `${paymentConfig.transferPrefix} ${cleanOrderId}`;
  
  // Format: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-compact2.png?amount=<AMOUNT>&addInfo=<CONTENT>&accountName=<NAME>
  return `https://img.vietqr.io/image/${paymentConfig.bankId}-${paymentConfig.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(paymentConfig.accountName)}`;
};

export default paymentConfig;
