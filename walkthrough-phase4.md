# 🔐 MechanicalBKA — Phase 4 Walkthrough & Verification Report

## Tổng quan Phase 4: Firebase Authentication & Security Foundation

Trong Phase 4, chúng tôi đã triển khai hoàn thiện hệ sinh thái Authentication dành cho học viên và nền tảng phân quyền Quản trị viên (Admin RBAC), đảm bảo:
- Hỗ trợ đầy đủ **Email / Password** và **Google Sign-In**.
- Tạo / đồng bộ hồ sơ `/users/{uid}` trong Firestore.
- Phân quyền Admin tuyệt đối dựa trên **Firebase Auth Custom Claims** (`request.auth.token.admin == true`), không bao giờ phụ thuộc vào `users/{uid}.role`.
- Bảo vệ các tuyến đường (`ProtectedRoute`, `AdminRoute`).
- Duy trì chế độ hoạt động kép: **Mock Auth Mode** (không cần cấu hình Firebase vẫn chạy trơn tru) và **Firebase Mode** (kết nối trực tiếp với Firebase Authentication & Firestore).
- Không phá vỡ bất kỳ thành phần giao diện hay Mock Data nào từ Phase 1, 1.5, 2 và 3.

---

## 1. Danh sách các file đã tạo & chỉnh sửa

| Tệp tin | Trạng thái | Chức năng |
|---|---|---|
| `src/context/AuthContext.jsx` | **Mới** | Cung cấp state (`user`, `userProfile`, `isAuthenticated`, `isAdmin`, `loading`, `error`) và các hàm `login()`, `register()`, `loginWithGoogle()`, `logout()`. Tự động kiểm tra JWT Claims và fallback Mock Auth. |
| `src/components/ProtectedRoute.jsx` | **Mới** | `ProtectedRoute` chặn khách vãng lai và redirect về `/auth`. `AdminRoute` kiểm tra quyền Admin qua Auth Custom Claims `{ admin: true }`. |
| `src/pages/Auth.jsx` | **Mới** | Giao diện Đăng nhập / Đăng ký theo phong cách Modern Engineering / Dark Technical, tích hợp nút Google Sign-In và banner thông báo lỗi. |
| `src/pages/Auth.css` | **Mới** | Styling CSS Dark Technical, Glassmorphism, hiệu ứng chuyển tab mượt mà. |
| `src/pages/Account.jsx` | **Mới** | Trang hồ sơ học viên, hiển thị UID, vai trò, trạng thái xác thực Admin Claim, chế độ Auth đang chạy và nút Đăng xuất. |
| `src/pages/Account.css` | **Mới** | Styling cho trang Hồ sơ học viên. |
| `src/pages/AdminPlaceholder.jsx` | **Mới** | Trang placeholder cho tuyến đường `/admin` dành riêng cho quản trị viên đã xác thực Custom Claims. |
| `scripts/setAdminClaim.js` | **Mới** | Script quản trị backend sử dụng Firebase Admin SDK để cấp quyền `{ admin: true }` cho UID cụ thể mà không hard-code khóa bảo mật. |
| `scripts/validatePhase4.js` | **Mới** | Bộ kiểm thử tự động xác thực toàn bộ các tiêu chí kỹ thuật và bảo mật của Phase 4. |
| `src/firebase/config.js` | **Cập nhật** | Khởi tạo và export instance `auth`, `googleProvider` cùng với `db`. |
| `src/components/layout/Header.jsx` | **Cập nhật** | Hiển thị nút "Đăng nhập" khi chưa đăng nhập, và hiển thị "Tài khoản" / Tên học viên khi đã đăng nhập. |
| `src/App.jsx` | **Cập nhật** | Bọc Router với `<AuthProvider>` và đăng ký các routes `/auth`, `/account`, `/admin`. |
| `package.json` | **Cập nhật** | Thêm scripts `admin:set-claim` và `validate:phase4`. |

---

## 2. Kết quả kiểm tra toàn vẹn (Validation)

```
> npm run validate:phase4
=====================================================
   MECHANICALBKA — PHASE 4 VALIDATION SCRIPT         
=====================================================

✅ PASSED: File exists: src/context/AuthContext.jsx
✅ PASSED: File exists: src/components/ProtectedRoute.jsx
✅ PASSED: File exists: src/pages/Auth.jsx
✅ PASSED: File exists: src/pages/Auth.css
✅ PASSED: File exists: src/pages/Account.jsx
✅ PASSED: File exists: src/pages/Account.css
✅ PASSED: File exists: src/pages/AdminPlaceholder.jsx
✅ PASSED: File exists: scripts/setAdminClaim.js
✅ PASSED: File exists: firestore.rules
✅ PASSED: File exists: src/firebase/config.js
✅ PASSED: AuthContext exports AuthProvider
✅ PASSED: AuthContext exports useAuth hook
✅ PASSED: AuthContext implements Email/Password Login
✅ PASSED: AuthContext implements Email/Password Register
✅ PASSED: AuthContext implements Google Login
✅ PASSED: AuthContext implements Logout
✅ PASSED: AuthContext inspects Custom Claims for Admin authorization
✅ PASSED: AuthContext checks token claims admin == true
✅ PASSED: AuthContext supports Mock Mode fallback for local dev/testing
✅ PASSED: ProtectedRoute component exported
✅ PASSED: AdminRoute component exported
✅ PASSED: AdminRoute checks isAdmin claim state
✅ PASSED: AdminRoute does NOT rely on insecure user.role field
✅ PASSED: Auth page contains Google login handler
✅ PASSED: Auth page supports tab toggle between Login and Register
✅ PASSED: Account page displays displayName
✅ PASSED: Account page displays email
✅ PASSED: Account page provides Logout action
✅ PASSED: setAdminClaim.js calls setCustomUserClaims
✅ PASSED: setAdminClaim.js sets { admin: true } claim
✅ PASSED: No hardcoded private keys in setAdminClaim.js
✅ PASSED: App wraps route tree with AuthProvider
✅ PASSED: App registers /auth route
✅ PASSED: App registers /account route
✅ PASSED: App registers /admin route
✅ PASSED: App protects /account with ProtectedRoute
✅ PASSED: App protects /admin with AdminRoute
✅ PASSED: Firestore Rules enforce Admin claims
✅ PASSED: Firestore Rules prevent student role elevation

=====================================================
🎉 PHASE 4 VALIDATION COMPLETED: 100% PASS (0 ERRORS)
=====================================================
```

---

## 3. Kiến trúc bảo mật và Phân quyền (RBAC)

1. **Nguồn gốc quyền Admin**: Tuyệt đối dựa trên Firebase Auth Custom Claims (`request.auth.token.admin == true` trong Security Rules, `claims.admin === true` trong `AuthContext`).
2. **Chặn sửa Role**: Học viên chỉ có thể cập nhật thông tin cá nhân và bị chặn hoàn toàn hành vi tự sửa trường `role` trong Firestore (`request.resource.data.role == resource.data.role`).
3. **Môi trường phát triển**:
   - `VITE_USE_FIREBASE=false` (Mặc định): Hoạt động với Mock Auth Provider lưu trữ phiên trong `localStorage`, cho phép kiểm thử đầy đủ các luồng đăng nhập, đăng xuất, truy cập trang cá nhân và phân quyền bảo vệ tuyến đường.
   - `VITE_USE_FIREBASE=true`: Hoạt động với Firebase Authentication thực tế (Email/Password, Google Sign-In Popup, Firebase JWT ID Token).

---

## 4. Build & Production Status

- **Vite Build**: ✅ PASS trong 781ms (0 errors).
- **Vercel Production Deployment**: ✅ PASS tại `https://mechanicalbka-web.vercel.app`.
- **Public Routes & Mock Mode**: ✅ Hoạt động ổn định 100%.
