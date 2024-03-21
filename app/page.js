"use client";

import { useState } from "react"; 
import Link from "next/link";
import { useUserAuth } from "./auth-context"; 

export default function Page() {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();


  const handleSignIn = async () => {
    await gitHubSignIn();
    console.log(user);
  };
  const handleSignOut = async () => {
    await firebaseSignOut();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-10 bg-blue-100">
      <h1 className="text-2xl font-bold mb-4 text-red-800">101 online battle</h1>
      {user ? (
        <>
          <p className="text-2xl font-bold mb-4 text-red-800">Welcome {user.displayName}!</p>
          <button className="mt-4 px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold  transition duration-300 ease-in-out">
            <Link href="/draw">Draw</Link>
          </button>
          <button className="mt-4 px-4 py-2 rounded-md bg-red-500 hover:bg-red-700 text-white font-bold  transition duration-300 ease-in-out"
            onClick={handleSignOut}>
            Sign Out
          </button>
        </>
      ) : (
        <>
          <p className="text-2xl font-bold mb-4 text-red-800">Please sign in to participate in the battle!</p>
          <button
            onClick={handleSignIn}
            className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In with GitHub
          </button>
        </>
      )}
    </div>
  );
}
