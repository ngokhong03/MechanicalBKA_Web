import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseEnabled } from '../firebase/config';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper: Format Vietnamese friendly error messages
export const formatAuthError = (error) => {
  if (!error) return '';
  const code = error.code || '';
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email hoặc mật khẩu không chính xác.';
    case 'auth/email-already-in-use':
      return 'Email này đã được đăng ký tài khoản.';
    case 'auth/weak-password':
      return 'Mật khẩu quá yếu (tối thiểu 6 ký tự).';
    case 'auth/invalid-email':
      return 'Địa chỉ email không đúng định dạng.';
    case 'auth/popup-closed-by-user':
      return 'Cửa sổ đăng nhập Google đã bị đóng.';
    case 'auth/network-request-failed':
      return 'Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền.';
    case 'auth/too-many-requests':
      return 'Quá nhiều lần thử thất bại. Vui lòng thử lại sau ít phút.';
    default:
      return error.message || 'Đã xảy ra lỗi trong quá trình xác thực.';
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Initial Auth Listener & Mock fallback handler
  useEffect(() => {
    // Mode A: Firebase Auth Enabled
    if (isFirebaseEnabled && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setLoading(true);
        if (firebaseUser) {
          try {
            // Get Custom Claims (Admin token verification)
            const tokenResult = await firebaseUser.getIdTokenResult();
            const hasAdminClaim = tokenResult.claims.admin === true;
            setIsAdmin(hasAdminClaim);

            // Fetch or create user profile in Firestore
            let profileData = null;
            if (db) {
              const userRef = doc(db, 'users', firebaseUser.uid);
              const userSnap = await getDoc(userRef);

              if (userSnap.exists()) {
                profileData = userSnap.data();
                // Update lastLoginAt
                await setDoc(userRef, { lastLoginAt: new Date().toISOString() }, { merge: true });
              } else {
                profileData = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName || 'Học viên MechanicalBKA',
                  role: 'student',
                  createdAt: new Date().toISOString(),
                  lastLoginAt: new Date().toISOString()
                };
                await setDoc(userRef, profileData);
              }
            }

            setUser(firebaseUser);
            setUserProfile(profileData);
          } catch (err) {
            console.error('[Auth] Lỗi xử lý hồ sơ Firestore:', err);
            setUser(firebaseUser);
          }
        } else {
          setUser(null);
          setUserProfile(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } 
    
    // Mode B: Mock Auth Mode (Offline / Local development)
    else {
      try {
        const storedMockUser = localStorage.getItem('mbka_mock_user');
        if (storedMockUser) {
          const parsed = JSON.parse(storedMockUser);
          setUser(parsed);
          setUserProfile(parsed.profile || parsed);
          setIsAdmin(parsed.claims?.admin === true);
        }
      } catch (err) {
        console.warn('[MockAuth] Lỗi đọc mock session:', err);
      }
      setLoading(false);
    }
  }, []);

  // 2. Register with Email/Password
  const register = async (email, password, displayName = '') => {
    setError(null);
    setLoading(true);

    if (isFirebaseEnabled && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;

        if (displayName) {
          await updateProfile(newUser, { displayName });
        }

        // Create Profile in Firestore
        if (db) {
          const initialProfile = {
            uid: newUser.uid,
            email: newUser.email,
            displayName: displayName || newUser.displayName || 'Học viên MechanicalBKA',
            role: 'student',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', newUser.uid), initialProfile);
          setUserProfile(initialProfile);
        }

        setLoading(false);
        return newUser;
      } catch (err) {
        const msg = formatAuthError(err);
        setError(msg);
        setLoading(false);
        throw new Error(msg);
      }
    } else {
      // Mock Register
      await new Promise(r => setTimeout(r, 400));
      const mockUid = `usr_${Date.now()}`;
      const mockUserObj = {
        uid: mockUid,
        email,
        displayName: displayName || email.split('@')[0],
        role: 'student',
        claims: { admin: false },
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      localStorage.setItem('mbka_mock_user', JSON.stringify(mockUserObj));
      setUser(mockUserObj);
      setUserProfile(mockUserObj);
      setIsAdmin(false);
      setLoading(false);
      return mockUserObj;
    }
  };

  // 3. Login with Email/Password
  const login = async (email, password) => {
    setError(null);
    setLoading(true);

    if (isFirebaseEnabled && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setLoading(false);
        return userCredential.user;
      } catch (err) {
        const msg = formatAuthError(err);
        setError(msg);
        setLoading(false);
        throw new Error(msg);
      }
    } else {
      // Mock Login
      await new Promise(r => setTimeout(r, 300));
      const isMockAdmin = email.toLowerCase().includes('admin');
      const mockUserObj = {
        uid: isMockAdmin ? 'usr_admin_001' : `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email,
        displayName: isMockAdmin ? 'Admin MechanicalBKA' : email.split('@')[0],
        role: isMockAdmin ? 'admin' : 'student',
        claims: { admin: isMockAdmin },
        createdAt: '2026-08-27T08:00:00Z',
        lastLoginAt: new Date().toISOString()
      };
      localStorage.setItem('mbka_mock_user', JSON.stringify(mockUserObj));
      setUser(mockUserObj);
      setUserProfile(mockUserObj);
      setIsAdmin(isMockAdmin);
      setLoading(false);
      return mockUserObj;
    }
  };

  // 4. Login with Google
  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);

    if (isFirebaseEnabled && auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        setLoading(false);
        return result.user;
      } catch (err) {
        const msg = formatAuthError(err);
        setError(msg);
        setLoading(false);
        throw new Error(msg);
      }
    } else {
      // Mock Google Login
      await new Promise(r => setTimeout(r, 400));
      const mockUserObj = {
        uid: 'usr_google_student_01',
        email: 'student.google@bka.edu.vn',
        displayName: 'Google Student User',
        role: 'student',
        claims: { admin: false },
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      localStorage.setItem('mbka_mock_user', JSON.stringify(mockUserObj));
      setUser(mockUserObj);
      setUserProfile(mockUserObj);
      setIsAdmin(false);
      setLoading(false);
      return mockUserObj;
    }
  };

  // 5. Logout
  const logout = async () => {
    setError(null);
    setLoading(true);

    if (isFirebaseEnabled && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error('[Auth] Lỗi đăng xuất Firebase:', err);
      }
    } else {
      localStorage.removeItem('mbka_mock_user');
    }

    setUser(null);
    setUserProfile(null);
    setIsAdmin(false);
    setLoading(false);
  };

  const value = {
    user,
    userProfile,
    isAuthenticated: !!user,
    isAdmin,
    loading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    clearError: () => setError(null)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
