import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

// Complete the web browser session
WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Configuration Google Sign-In
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID || 'VOTRE_EXPO_CLIENT_ID',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'VOTRE_IOS_CLIENT_ID',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'VOTRE_ANDROID_CLIENT_ID',
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '315729549963-efe12843d4d15e437e528e.apps.googleusercontent.com',
  });

  // Monitor auth state changes with Firestore sync
  useEffect(() => {
    let firestoreUnsubscribe = null;

    const authUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Setup Firestore listener for real-time sync
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        firestoreUnsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
          const firestoreData = docSnapshot.exists() ? docSnapshot.data() : {};
          const resolvedName = firestoreData.name
            || firebaseUser.displayName
            || firebaseUser.email?.split('@')[0]
            || '';

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            name: resolvedName,
            ...firestoreData,
          });
        }, (error) => {
          console.error('Firestore listener error:', error);
          // Fallback: utiliser displayName de Firebase Auth (défini dans signUp)
          setUser(prev => ({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
            // Préserver les données locales déjà en mémoire (ex: selectedAdvisor)
            ...(prev?.uid === firebaseUser.uid ? prev : {}),
          }));
        });
      } else {
        setUser(null);
        if (firestoreUnsubscribe) {
          firestoreUnsubscribe();
          firestoreUnsubscribe = null;
        }
      }
      
      if (initializing) {
        setInitializing(false);
      }
      setLoading(false);
    });

    return () => {
      authUnsubscribe();
      if (firestoreUnsubscribe) {
        firestoreUnsubscribe();
      }
    };
  }, []);

  // Handle Google Sign-In response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  // Sign in with email and password
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Load additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        ...userDoc.data(),
      });
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email, password, userData = {}) => {
    setLoading(true);
    try {
      console.log('Creating account...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Account created:', userCredential.user.uid);

      // Sauvegarder le nom dans Firebase Auth pour qu'il persiste
      if (userData.name) {
        await updateProfile(userCredential.user, { displayName: userData.name });
      }

      const userDataToSave = {
        email,
        name: userData.name || '',
        createdAt: new Date().toISOString(),
        ...userData,
      };

      // Try to save to Firestore in background (don't wait)
      setDoc(doc(db, 'users', userCredential.user.uid), userDataToSave).catch(err => {
        console.error('Firestore save error (ignored):', err);
      });

      // Update local user state IMMEDIATELY
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userData.name || userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        ...userDataToSave,
      });

      console.log('SignUp successful!');
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      // Sur le web, utiliser Firebase Popup
      if (Platform.OS === 'web') {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        
        // Créer ou mettre à jour le document utilisateur dans Firestore
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', result.user.uid), {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            createdAt: new Date().toISOString(),
          });
        }
        
        return { success: true, user: result.user };
      }
      
      // Sur mobile, utiliser expo-auth-session
      const result = await promptAsync();
      if (result.type === 'success') {
        return { success: true };
      }
      return { success: false, error: 'Google sign-in cancelled' };
    } catch (error) {
      console.error('Google sign in error:', error);
      
      // Gérer les erreurs spécifiques
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Google sign-in cancelled' };
      }
      
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (userData) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    try {
      console.log('Updating profile for user:', user.uid, 'with data:', userData);
      
      // Update local state IMMEDIATELY
      setUser({ ...user, ...userData });
      
      // Try to save to Firestore in background (don't wait)
      setDoc(doc(db, 'users', user.uid), userData, { merge: true }).catch(err => {
        console.error('Firestore update error (ignored):', err);
      });
      
      console.log('Profile updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    initializing,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!initializing && children}
    </AuthContext.Provider>
  );
};
