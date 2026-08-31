import fs from 'fs';
import path from 'path';

console.log('=====================================================');
console.log('   MECHANICALBKA — PHASE 4 VALIDATION SCRIPT         ');
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

// 1. Check required Phase 4 files
const requiredFiles = [
  'src/context/AuthContext.jsx',
  'src/components/ProtectedRoute.jsx',
  'src/pages/Auth.jsx',
  'src/pages/Auth.css',
  'src/pages/Account.jsx',
  'src/pages/Account.css',
  'src/pages/AdminPlaceholder.jsx',
  'scripts/setAdminClaim.js',
  'firestore.rules',
  'src/firebase/config.js'
];

requiredFiles.forEach(file => {
  const fullPath = path.resolve(file);
  assert(fs.existsSync(fullPath), `File exists: ${file}`);
});

// 2. Validate AuthContext.jsx
const authContextCode = fs.readFileSync(path.resolve('src/context/AuthContext.jsx'), 'utf8');
assert(authContextCode.includes('export const AuthProvider'), 'AuthContext exports AuthProvider');
assert(authContextCode.includes('export const useAuth'), 'AuthContext exports useAuth hook');
assert(authContextCode.includes('signInWithEmailAndPassword'), 'AuthContext implements Email/Password Login');
assert(authContextCode.includes('createUserWithEmailAndPassword'), 'AuthContext implements Email/Password Register');
assert(authContextCode.includes('signInWithPopup'), 'AuthContext implements Google Login');
assert(authContextCode.includes('signOut'), 'AuthContext implements Logout');
assert(authContextCode.includes('getIdTokenResult'), 'AuthContext inspects Custom Claims for Admin authorization');
assert(authContextCode.includes('tokenResult.claims.admin === true'), 'AuthContext checks token claims admin == true');
assert(authContextCode.includes('mbka_mock_user'), 'AuthContext supports Mock Mode fallback for local dev/testing');

// 3. Validate ProtectedRoute.jsx
const protectedRouteCode = fs.readFileSync(path.resolve('src/components/ProtectedRoute.jsx'), 'utf8');
assert(protectedRouteCode.includes('export const ProtectedRoute'), 'ProtectedRoute component exported');
assert(protectedRouteCode.includes('export const AdminRoute'), 'AdminRoute component exported');
assert(protectedRouteCode.includes('isAdmin'), 'AdminRoute checks isAdmin claim state');
assert(!protectedRouteCode.includes('user.role === \'admin\''), 'AdminRoute does NOT rely on insecure user.role field');

// 4. Validate Auth.jsx and Account.jsx
const authPageCode = fs.readFileSync(path.resolve('src/pages/Auth.jsx'), 'utf8');
assert(authPageCode.includes('loginWithGoogle'), 'Auth page contains Google login handler');
assert(authPageCode.includes('isRegisterMode'), 'Auth page supports tab toggle between Login and Register');

const accountPageCode = fs.readFileSync(path.resolve('src/pages/Account.jsx'), 'utf8');
assert(accountPageCode.includes('displayName'), 'Account page displays displayName');
assert(accountPageCode.includes('email'), 'Account page displays email');
assert(accountPageCode.includes('logout'), 'Account page provides Logout action');

// 5. Validate setAdminClaim.js
const setAdminClaimCode = fs.readFileSync(path.resolve('scripts/setAdminClaim.js'), 'utf8');
assert(setAdminClaimCode.includes('setCustomUserClaims'), 'setAdminClaim.js calls setCustomUserClaims');
assert(setAdminClaimCode.includes('{ admin: true }'), 'setAdminClaim.js sets { admin: true } claim');
assert(!setAdminClaimCode.includes('"private_key": "-----BEGIN'), 'No hardcoded private keys in setAdminClaim.js');

// 6. Validate App.jsx Routing
const appCode = fs.readFileSync(path.resolve('src/App.jsx'), 'utf8');
assert(appCode.includes('<AuthProvider>'), 'App wraps route tree with AuthProvider');
assert(appCode.includes('path="/auth"'), 'App registers /auth route');
assert(appCode.includes('path="/account"'), 'App registers /account route');
assert(appCode.includes('path="/admin"'), 'App registers /admin route');
assert(appCode.includes('<ProtectedRoute>'), 'App protects /account with ProtectedRoute');
assert(appCode.includes('<AdminRoute>'), 'App protects /admin with AdminRoute');

// 7. Validate Security Rules
const rulesContent = fs.readFileSync(path.resolve('firestore.rules'), 'utf8');
assert(rulesContent.includes('request.auth.token.admin == true'), 'Firestore Rules enforce Admin claims');
assert(rulesContent.includes('request.resource.data.role == resource.data.role'), 'Firestore Rules prevent student role elevation');

console.log('\n=====================================================');
if (errorCount === 0) {
  console.log('🎉 PHASE 4 VALIDATION COMPLETED: 100% PASS (0 ERRORS)');
} else {
  console.error(`❌ PHASE 4 VALIDATION FAILED WITH ${errorCount} ERRORS`);
  process.exit(1);
}
console.log('=====================================================\n');
