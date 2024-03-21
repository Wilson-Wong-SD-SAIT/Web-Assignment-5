// Directive for Next.js to only run this code on the client-side.
"use client";

// Importing necessary hooks from React for managing state and effects,
// and context for providing a way to pass data through the component tree.
import { useContext, createContext, useState, useEffect } from "react";
// Importing specific authentication functions from the Firebase auth module.
// These include methods for signing in with a popup, signing out,
// and listening for authentication state changes, along with GitHub auth provider.
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GithubAuthProvider,
} from "firebase/auth";
// Import the authenticated Firebase instance from the local firebase module.
import { auth } from "./firebase";

// Create a new React context for authentication; it's a construct that allows us to pass data deeply throughout the component tree.
const AuthContext = createContext();

// Define a provider component for the authentication context.
// It uses React's children prop to pass down components.
export const AuthContextProvider = ({ children }) => {
  // State hook for keeping track of the user's authentication status.
  const [user, setUser] = useState(null);

  // Function to sign in using GitHub with Firebase.
  // It creates a new instance of the GithubAuthProvider and then uses Firebase's signInWithPopup method.
  const gitHubSignIn = () => {
    const provider = new GithubAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Function to sign out using Firebase's signOut method.
  const firebaseSignOut = () => {
    return signOut(auth);
  };

  // Effect hook to monitor the authentication state change.
  // It sets the user state based on Firebase's current user.
  // Cleans up by unsubscribing from the auth state listener when the component unmounts or user changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup function to unsubscribe from the listener.
  }, [user]);

  // The provider component passes the user, signIn, and signOut functions down to any descendants in the component tree.
  return (
    <AuthContext.Provider value={{ user, gitHubSignIn, firebaseSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to allow easy consumption of the authentication context values (user, signIn, signOut) in other components.
export const useUserAuth = () => {
  return useContext(AuthContext);
};
