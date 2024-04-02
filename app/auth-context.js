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
  // 
  const [userData, setUserData] = useState(null);

  // Function to sign in using GitHub with Firebase.
  // It creates a new instance of the GithubAuthProvider and then uses Firebase's signInWithPopup method.
  const gitHubSignIn = () => {
    const provider = new GithubAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Function to sign out using Firebase's signOut method.
  const firebaseSignOut = () => {
    setUserData(null);
    return signOut(auth);
  };

  // 
  const onSetUserData = (newItems) => {
    setUserData(newItems);
  };

  // Asynchronously fetches user data from Firestore
  async function fetchDataFromFirestore(uid, email) {
    if (user !== null){
      try {
        // Sends a GET request to get user items.
        const response = await fetch(`/api/user/${uid}`);
        if (response.ok) {
          const json = await response.json(); 
          if (json.exist) {
            // Set Existing User items to context
            setUserData(json);
            console.log("Document has been retrieved"); 
          } else {
            // Create New User
            let name = null;
            while (!name){ name = prompt("Please enter your Username","Ash Ketchum"); setTimeout(()=>{}, 1000);}
              // Sends a PUT request to update user data for draw.
              const createResponse = await fetch(`/api/user/${uid}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name, email: email,}), 
              });
              if (createResponse.ok) {
                const createJson = await createResponse.json(); 
                setUserData(createJson);
                console.log("Document has been created"); // Logs the ID of the new document if addition is successful.
              } else {
                throw new Error("Failed to call API create new user."); // Throws an error if the response is not OK.
              }
          }
        } else {
          throw new Error("Failed to call API fetch existing user items."); // Throws an error if the response is not OK.
        }
      } catch (error) {
        console.error("Error occurred: ", error); // Logs an error message if the addition fails.
      }
    }
  }

  // Effect hook to monitor the authentication state change.
  // It sets the user state based on Firebase's current user.
  // Cleans up by unsubscribing from the auth state listener when the component unmounts or user changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser !== null){
        fetchDataFromFirestore(currentUser.uid,currentUser.email);
      }  
      
    });
    return () => unsubscribe(); // Cleanup function to unsubscribe from the listener.
  }, [user]);

  // The provider component passes the user, signIn, and signOut functions down to any descendants in the component tree.
  return (
    <AuthContext.Provider value={{ user, gitHubSignIn, firebaseSignOut, userData, onSetUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to allow easy consumption of the authentication context values (user, signIn, signOut) in other components.
export const useUserAuth = () => {
  return useContext(AuthContext);
};
