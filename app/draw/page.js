"use client"; // This directive indicates that we're using this file in a client-side environment.

import React, { useState, useEffect } from "react";
import { useUserAuth } from "../auth-context"; // Adjust the path as needed
import Link from "next/link";
import { db } from "@/app/firebase"; // Your custom Firebase configuration
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore"; 

// Asynchronously fetches user data from Firestore
async function fetchDataFromFirestore(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data().items; // Return the array containing all user item
}

async function addDataToFireStore(uid, email, item) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Attempts to add a new document to the 'users' collection with the provided uid, email, and item.
      await updateDoc(doc(db, "users", uid), {
        email: email,
        items: arrayUnion(item),
      });
    } else {
      await setDoc(doc(db, "users", uid), {
        email: email,
        items: [item],
      });
    }
    console.log("Document has been written"); // Logs the ID of the new document if addition is successful.
    return true; // Returns true to indicate that the document was successfully added.
  } catch (error) {
    console.error("Error occurred: ", error); // Logs an error message if the addition fails.
    return false; // Returns false to indicate that the document was not added due to an error.
  }
}

export default function Draw() {
  const [ownItems, setOownItems] = useState([]);
  const { user } = useUserAuth(); // Assume no need for firebaseSignOut directly here unless a logout feature on this page is desired

  const fetchDraw =
  fetch("https://rps101.pythonanywhere.com/api/v1/objects/all") 
  .then(response => response.json())
  .then(json =>  json[Math.floor((Math.random() * 101))] ); 

  async function onClickDraw() {
    let item = await fetchDraw;
    alert("You just draw: " + item); 
    //setOownItems([...ownItems, item]);
    const added = await addDataToFireStore( user.uid, user.email, item ); 
    const data = await fetchDataFromFirestore(user.uid);
    setOownItems(data);
    if (added) {
      // If the data was successfully added:
      console.log("Data Stored to Firestore!"); // Shows a success message to the user.
    } else {
      // If there was an error adding the data:
      alert("There was an Error while saving data"); // Shows an error message to the user.
    }
  }

  // Fetch user data from Firestore when the component mounts
  useEffect(() => {
    async function fetchData() {
      const data = await fetchDataFromFirestore(user.uid); // Get user data from Firestore
      setOownItems(data); // Update state with the fetched user data
    }
     // Call the fetchData function
    if (!user == null){
      fetchData();
    }   
  }, []); 

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-blue-100">
      <h1 className="text-2xl font-bold mb-4 text-red-800">
        Your total items would refresh after draw
      </h1>
      {user ? (
        <button className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        onClick={onClickDraw}>
          Try my luck
        </button>
      ) : (
        <p>Please log in to see the weather information.</p>
      )}
        <button className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
            <Link href="/">Home</Link>
        </button>
      {
        ownItems.map(ownItem => <p className="text-lg text-gray-800" key={ownItem} >{ownItem}</p>)
      }
    </main>
  );
}
