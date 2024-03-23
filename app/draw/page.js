"use client"; // This directive indicates that we're using this file in a client-side environment.

import React from "react";
import { useUserAuth } from "../auth-context"; // Adjust the path as needed
import Link from "next/link";

export default function Draw() {
  const { user, onSetUserData } = useUserAuth(); // Assume no need for firebaseSignOut directly here unless a logout feature on this page is desired

  async function onClickDraw() {
    try {
      const response = await fetch(`http://localhost:3001/api/draw/${user.uid}`); // Sends a GET request to the API.
      if (response.ok) {
        const json = await response.json(); 
        alert("You just draw: " + json.item); 
        onSetUserData(json.data);
      } else {
        console.log("Failed to fetch users."); // Throws an error if the response is not OK.
      }
    } catch (error) {
      console.error("Error occurred: ", error); // Logs an error message if the addition fails.
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-blue-100">
      <h1 className="text-2xl font-bold mb-4 text-red-800">
        Beware you could not own duplicate item
      </h1>
      {user ? (
        <>
          <button className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          onClick={onClickDraw}>
            Try my luck
          </button>
        </>
      ) : (
        <p>Please log in to see the weather information.</p>
      )}
        <button className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
            <Link href="/">Home</Link>
        </button>

    </main>
  );
}
