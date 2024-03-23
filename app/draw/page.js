"use client"; // This directive indicates that we're using this file in a client-side environment.

import React from "react";
import { useUserAuth } from "../auth-context"; // Adjust the path as needed
import Link from "next/link";
import { db } from "@/app/firebase"; // Your custom Firebase configuration
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"; 


export default function Draw() {
  const { user, onSetUserData } = useUserAuth(); // Assume no need for firebaseSignOut directly here unless a logout feature on this page is desired

  const fetchDraw =
  fetch("https://rps101.pythonanywhere.com/api/v1/objects/all") 
  .then(response => response.json())
  .then(json =>  json[Math.floor((Math.random() * 101))] ); 

  async function addDataToFireStore(uid, item) {
    try {
      await updateDoc(doc(db, "users", uid), {
        items: arrayUnion(item),
      });
      // update userData in context
      const querySnapshot = await getDoc(doc(db, "users", uid));
      onSetUserData(querySnapshot.data());

      console.log("Document has been written"); // Logs the ID of the new document if addition is successful.
      return true; // Returns true to indicate that the document was successfully added.
    } catch (error) {
      console.error("Error occurred: ", error); // Logs an error message if the addition fails.
      return false; // Returns false to indicate that the document was not added due to an error.
    }
  }

  async function onClickDraw() {
    let item = await fetchDraw;
    alert("You just draw: " + item); 
    const added = await addDataToFireStore( user.uid, item ); 
    if (added) {
      // If the data was successfully added:
      console.log("Data Stored to Firestore!"); // Shows a success message to the user.
    } else {
      // If there was an error adding the data:
      alert("There was an Error while saving data"); // Shows an error message to the user.
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
