"use client";

import Link from "next/link";
import { useUserAuth } from "./auth-context"; 


export default function Page() {
  const { user, gitHubSignIn, firebaseSignOut, userData } = useUserAuth();

  const handleSignIn = async () => {
    await gitHubSignIn();
    console.log(user);
  };
  const handleSignOut = async () => {
    await firebaseSignOut();
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-10 bg-[#4f0606]">
    {user && userData ? (
      <>
        <p className="text-3xl font-bold mb-6">Welcome to the ring {userData.name}!</p>
        <div className="flex flex-col items-center space-y-4">
          <div>
            <button className="px-6 py-3 rounded-full bg-[#006054] hover:bg-teal-950 text-white font-bold text-lg shadow-md transition duration-300 ease-in-out">
              <Link href="/draw">Draw your items!</Link>
            </button>
          </div>
          <div>
            <button className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-800 text-white font-bold text-lg shadow-md transition duration-300 ease-in-out">
              <Link href="/battle">FIGHT</Link>
            </button>
          </div>
          <div>
            <button
              className="px-6 py-3 rounded-full bg-gray-700 hover:bg-gray-800 text-white font-bold text-lg shadow-md transition duration-300 ease-in-out"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>
      </>
    ) : (
      <>
        <p className="text-3xl font-bold mb-6">Sign in to enter the ring!</p>
        <button
          onClick={handleSignIn}
          className="px-6 py-3 rounded-full bg-[#004763] hover:bg-cyan-950 text-white font-bold text-lg shadow-md transition duration-300 ease-in-out"
        >
          Sign In with GitHub
        </button>
      </>
    )}
  </div>
  );
}