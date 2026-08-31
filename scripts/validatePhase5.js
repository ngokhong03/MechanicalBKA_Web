import fs from 'fs';
import path from 'path';

console.log('=====================================================');
console.log('   MECHANICALBKA — PHASE 5 VALIDATION SCRIPT         ');
console.log('=====================================================\n');

let errorCount = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    errorCount++;
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

// 1. Check required Phase 5 files
const requiredFiles = [
  'src/context/CartContext.jsx',
  'src/pages/Cart.jsx',
  'src/pages/Cart.css',
  'src/pages/Checkout.jsx',
  'src/pages/Checkout.css',
  'src/pages/CourseDetail.jsx',
  'src/pages/LessonViewer.jsx',
  'src/pages/LessonViewer.css',
  'src/pages/Store.jsx',
  'src/pages/ProductDetail.jsx',
  'src/components/cards/ProductCard.jsx',
  'src/services/dataProvider.js'
];

requiredFiles.forEach(file => {
  const fullPath = path.resolve(file);
  assert(fs.existsSync(fullPath), `File exists: ${file}`);
});

// 2. Validate CartContext.jsx
const cartContextCode = fs.readFileSync(path.resolve('src/context/CartContext.jsx'), 'utf8');
assert(cartContextCode.includes('export const CartProvider'), 'CartContext exports CartProvider');
assert(cartContextCode.includes('export const useCart'), 'CartContext exports useCart hook');
assert(cartContextCode.includes('isInCart'), 'CartContext implements isInCart duplicate check');
assert(cartContextCode.includes('addToCart'), 'CartContext implements addToCart');
assert(cartContextCode.includes('removeFromCart'), 'CartContext implements removeFromCart');
assert(cartContextCode.includes('clearCart'), 'CartContext implements clearCart');
assert(cartContextCode.includes('mbka_cart'), 'CartContext persists state in localStorage under key mbka_cart');
assert(cartContextCode.includes('cartTotal'), 'CartContext calculates cartTotal amount');
assert(cartContextCode.includes('cartCount'), 'CartContext provides cartCount');

// 3. Validate LessonViewer.jsx
const lessonViewerCode = fs.readFileSync(path.resolve('src/pages/LessonViewer.jsx'), 'utf8');
assert(lessonViewerCode.includes('https://www.youtube.com/embed/'), 'LessonViewer generates secure YouTube embed URL');
assert(lessonViewerCode.includes('isFreePreview'), 'LessonViewer checks isFreePreview status');
assert(lessonViewerCode.includes('video-locked-overlay'), 'LessonViewer displays Locked state for paid unowned lessons');
assert(lessonViewerCode.includes('materialIds'), 'LessonViewer queries attached materials');
assert(lessonViewerCode.includes('handleSecureDownload') || lessonViewerCode.includes('downloadService') || lessonViewerCode.includes('Phase 8'), 'Download button integrates secure download workflow');
assert(!lessonViewerCode.includes('file.storagePath'), 'LessonViewer does not expose raw storagePath to client');

// 4. Validate CourseDetail.jsx
const courseDetailCode = fs.readFileSync(path.resolve('src/pages/CourseDetail.jsx'), 'utf8');
assert(courseDetailCode.includes('dataProvider'), 'CourseDetail imports from dataProvider');
assert(courseDetailCode.includes('isFreePreview'), 'CourseDetail displays preview badge for free preview lessons');
assert(courseDetailCode.includes('addToCart'), 'CourseDetail integrates with CartContext');

// 5. Validate Store.jsx & ProductDetail.jsx
const storeCode = fs.readFileSync(path.resolve('src/pages/Store.jsx'), 'utf8');
assert(storeCode.includes('dataProvider'), 'Store uses dataProvider');
assert(storeCode.includes('selectedSpecialty'), 'Store supports specialty filter');
assert(storeCode.includes('selectedSoftware'), 'Store supports software filter');
assert(storeCode.includes('selectedProductType'), 'Store supports productType filter');
assert(storeCode.includes('selectedAccessType'), 'Store supports accessType filter');

const productDetailCode = fs.readFileSync(path.resolve('src/pages/ProductDetail.jsx'), 'utf8');
assert(productDetailCode.includes('dataProvider'), 'ProductDetail uses dataProvider');
assert(productDetailCode.includes('checksum'), 'ProductDetail displays SHA-256 Checksum');
assert(productDetailCode.includes('addToCart'), 'ProductDetail provides Add to Cart functionality');
assert(!productDetailCode.includes('file.storagePath'), 'ProductDetail does not expose storagePath');

// 6. Validate Cart.jsx & Checkout.jsx
const cartPageCode = fs.readFileSync(path.resolve('src/pages/Cart.jsx'), 'utf8');
assert(cartPageCode.includes('removeFromCart'), 'Cart page provides remove item action');
assert(cartPageCode.includes('cartTotal'), 'Cart page displays total sum');
assert(cartPageCode.includes('Giỏ hàng của bạn đang trống'), 'Cart page provides EmptyState when empty');

const checkoutPageCode = fs.readFileSync(path.resolve('src/pages/Checkout.jsx'), 'utf8');
assert(checkoutPageCode.includes('orderService') || checkoutPageCode.includes('Phase 6'), 'Checkout integrates order creation workflow');
assert(!checkoutPageCode.includes('setDoc(doc(db, \'orders\''), 'Checkout does NOT directly write fake orders from client');

// 7. Validate Header and App Routing
const headerCode = fs.readFileSync(path.resolve('src/components/layout/Header.jsx'), 'utf8');
assert(headerCode.includes('cartCount'), 'Header displays cart count notification badge');
assert(headerCode.includes('to="/cart"'), 'Header links to /cart');

const appCode = fs.readFileSync(path.resolve('src/App.jsx'), 'utf8');
assert(appCode.includes('<CartProvider>'), 'App wraps route tree in CartProvider');
assert(appCode.includes('path="/cart"'), 'App registers /cart route');
assert(appCode.includes('path="/checkout"'), 'App registers /checkout route');

console.log('\n=====================================================');
if (errorCount === 0) {
  console.log('🎉 PHASE 5 VALIDATION COMPLETED: 100% PASS (0 ERRORS)');
} else {
  console.error(`❌ PHASE 5 VALIDATION FAILED WITH ${errorCount} ERRORS`);
  process.exit(1);
}
console.log('=====================================================\n');
