# 💳 MechanicalBKA — Phase 6 Walkthrough & Verification Report

## Tổng quan Phase 6: Orders + Manual Bank Transfer & VietQR

Trong Phase 6, chúng tôi đã hoàn thiện toàn bộ hệ thống tạo và quản lý **Đơn Hàng (Orders)**, cơ chế **Bảo Mật Giá (Server Price Verification)**, hướng dẫn **Chuyển Khoản Ngân Hàng / VietQR**, và trang **Lịch Sử Đơn Hàng (Order History)**:

1. **Bảo Mật Giá Tuyệt Đối (Price Security)**:
   - Frontend **tuyệt đối không gửi** và **Backend tuyệt đối không tin** các trường `price`, `snapshotPrice`, `totalAmount`, `orderStatus`, `paymentStatus` từ client/localStorage.
   - Client chỉ gửi mảng định danh: `[{ targetId, targetType }]`.
   - `orderService.createOrder` truy vấn trực tiếp thực thể từ `dataProvider` (khóa học / học liệu), xác thực `isPublished === true`, trích xuất giá thực tế, tạo immutable snapshot `snapshotTitle`, `snapshotPrice`, và tính tổng tiền `totalAmount`.

2. **Cơ Chế Chống Trùng Lặp (Idempotency & Fraud Prevention)**:
   - Hỗ trợ `idempotencyKey` ngăn chặn người dùng double-click hoặc gửi lặp request tạo đơn hàng.
   - Trạng thái khởi tạo bắt buộc: `orderStatus = "pending"`, `paymentStatus = "unpaid"`, `paymentMethod = "bank_transfer"`.

3. **Cấu Hình Ngân Hàng & VietQR Tập Trung (`src/config/payment.js`)**:
   - Quản trị thông tin thanh toán (Tên ngân hàng, Số tài khoản, Chủ tài khoản, Chi nhánh, Tiền tố nội dung `MBKA`).
   - Helper `generateVietQRUrl` tự động tạo mã QR VietQR chuẩn xác, bảo mật, không nhúng API secret key.

4. **Trang Checkout (`src/pages/Checkout.jsx`)**:
   - Yêu cầu đăng nhập học viên trước khi tiến hành thanh toán (tự động chuyển hướng về `/auth` kèm state ghi nhớ).
   - Hiển thị danh mục học liệu trước khi xác nhận.
   - Sau khi tạo đơn thành công: Hiển thị Mã đơn hàng (`ord_...`), Bảng thông tin chuyển khoản ngân hàng (có nút Copy nhanh số tài khoản & nội dung chuyển khoản), và Mã VietQR quét tự động.
   - Giỏ hàng chỉ được làm trống (`clearCart()`) sau khi đơn hàng được ghi nhận thành công.

5. **Trang Lịch Sử Đơn Hàng (`src/pages/OrderHistory.jsx`)**:
   - Truy cập tại `/account/orders` và được bảo vệ bởi `ProtectedRoute`.
   - Học viên chỉ xem được danh sách đơn hàng của chính mình (`userId == auth.uid`).
   - Hiển thị đầy đủ: Mã đơn, Thời gian tạo, Danh sách item, Tổng tiền, Huy hiệu trạng thái thanh toán (`ĐÃ THANH TOÁN` / `CHƯA THANH TOÁN`), Trạng thái đơn (`HOÀN TẤT` / `CHỜ DUYỆT`).
   - Đơn hàng chưa thanh toán có nút mở rộng để xem lại mã VietQR và hướng dẫn chuyển khoản.

6. **Bảo Mật Firestore Rules (`firestore.rules`)**:
   - Học viên chỉ đọc được đơn hàng của chính mình (`resource.data.userId == request.auth.uid || isAdmin()`).
   - Học viên chỉ được tạo đơn với `userId == request.auth.uid`, `orderStatus == 'pending'`, `paymentStatus == 'unpaid'`.
   - Chỉ Quản trị viên (`request.auth.token.admin == true`) mới có quyền cập nhật trạng thái đơn (duyệt thanh toán) hoặc xóa đơn. Học viên hoàn toàn không thể tự leo thang `paymentStatus` sang `paid`.

7. **Tương Thích Mock Mode & Firebase Mode**:
   - `VITE_USE_FIREBASE=false`: Đơn hàng được lưu trữ an toàn trong `localStorage` (`'mbka_mock_orders'`), mô phỏng đầy đủ quy trình đặt hàng và lịch sử đơn.
   - `VITE_USE_FIREBASE=true`: Đơn hàng được lưu vào Cloud Firestore collection `/orders/{orderId}`.

---

## Danh sách tệp tin Created / Modified

| Tệp tin | Trạng thái | Chức năng |
|---|---|---|
| `src/config/payment.js` | **Mới** | Cấu hình thông tin ngân hàng & helper tạo URL VietQR. |
| `src/services/orderService.js` | **Mới** | Service xử lý tính giá server-side, tạo đơn hàng, chống gửi trùng lặp, lấy lịch sử đơn. |
| `src/pages/OrderHistory.jsx` | **Mới** | Trang Lịch Sử Đơn Hàng của học viên, trạng thái đơn, mã VietQR. |
| `src/pages/OrderHistory.css` | **Mới** | CSS Dark Technical cho Order History. |
| `scripts/validatePhase6.js` | **Mới** | Script kiểm thử tự động toàn bộ 100% tiêu chí kỹ thuật Phase 6. |
| `src/pages/Checkout.jsx` | **Cập nhật** | Xử lý tạo đơn hàng qua `orderService`, hiển thị bảng ngân hàng và VietQR. |
| `src/pages/Checkout.css` | **Cập nhật** | CSS cho thông tin chuyển khoản ngân hàng và VietQR code. |
| `src/pages/Account.jsx` | **Cập nhật** | Bổ sung lối tắt đến trang Lịch Sử Đơn Hàng. |
| `src/App.jsx` | **Cập nhật** | Đăng ký route `/account/orders` và cập nhật tiêu đề trang động. |
| `.env.example` | **Cập nhật** | Tài liệu hóa các biến môi trường cấu hình ngân hàng & VietQR. |
| `package.json` | **Cập nhật** | Thêm script `validate:phase6`. |

---

## Kết quả kiểm thử toàn vẹn (`npm run validate:phase6`)

```
=====================================================
   MECHANICALBKA — PHASE 6 VALIDATION SCRIPT         
=====================================================

✅ PASSED: File exists: src/config/payment.js
✅ PASSED: File exists: src/services/orderService.js
✅ PASSED: File exists: src/pages/Checkout.jsx
✅ PASSED: File exists: src/pages/Checkout.css
✅ PASSED: File exists: src/pages/OrderHistory.jsx
✅ PASSED: File exists: src/pages/OrderHistory.css
✅ PASSED: File exists: firestore.rules
✅ PASSED: payment.js exports paymentConfig
✅ PASSED: payment.js exports generateVietQRUrl helper
✅ PASSED: VietQR URL generated safely without client secrets
✅ PASSED: orderService exports createOrder
✅ PASSED: orderService exports getUserOrders
✅ PASSED: orderService exports confirmOrderPayment
✅ PASSED: orderService supports idempotency key checking
✅ PASSED: Initial orderStatus is pending
✅ PASSED: Initial paymentStatus is unpaid
✅ PASSED: orderService creates immutable snapshotTitle
✅ PASSED: orderService creates immutable snapshotPrice
✅ PASSED: createOrder queries real price from dataProvider and ignores client prices
✅ PASSED: Checkout calls orderService.createOrder
✅ PASSED: Checkout clears cart only upon order success
✅ PASSED: Checkout displays VietQR transfer instructions
✅ PASSED: OrderHistory loads orders via getUserOrders
✅ PASSED: OrderHistory renders distinct payment status pills
✅ PASSED: Firestore Rules define match for /orders/{orderId}
✅ PASSED: Student can only read their own orders
✅ PASSED: Student can only create pending orders
✅ PASSED: Student can only create unpaid orders
✅ PASSED: Only Admin can update order paymentStatus/orderStatus
✅ PASSED: App registers /checkout route
✅ PASSED: App registers /account/orders route

--- Chạy thử nghiệm giả lập Bảo Mật Giá (Price Security Test) ---
✅ PASSED: Client tampered price (1000đ) was discarded. Server computed: 450000đ
✅ PASSED: Tampered price was completely ignored

=====================================================
🎉 PHASE 6 VALIDATION COMPLETED: 100% PASS (0 ERRORS)
=====================================================
```
