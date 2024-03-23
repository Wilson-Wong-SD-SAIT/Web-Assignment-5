"use client"; // This directive indicates that we're using this file in a client-side environment.

import React, { useState, useEffect } from "react";
import { useUserAuth } from "../auth-context"; // Adjust the path as needed
import Link from "next/link";
import { db } from "../firebase"; // Your custom Firebase configuration
import { collection, doc, getDoc, getDocs, updateDoc, arrayRemove, arrayUnion, increment  } from "firebase/firestore"; 

// Asynchronously fetches user data from Firestore
async function fetchDataFromFirestore() {
    const querySnapshot = await getDocs(collection(db, "users")); // Gets all documents from the 'users' collection
    const data = []; // Initialize an empty array to hold our user data
    querySnapshot.forEach((doc) => {
      // Loop through each document in the collection
      data.push({ id: doc.id, ...doc.data() }); // Add the document data (and its Firestore ID) to the data array
    });
    return data; // Return the array containing all user data
}

export default function Battle() {
  // State variables for the component
  const [usersData, setUsersData] = useState([]); // Holds array of user data fetched from Firestore
  const { user, userData, onSetUserData } = useUserAuth(); // Assume no need for firebaseSignOut directly here unless a logout feature on this page is desired

  async function onClickBattle(e) {
    if (userData.items.length == 0) {
      alert("You don't have any battler. Draw first.")
      return;
    }
    let playerId = user.uid;
    // pick randomr battler from User
    let playerBattler = userData.items[Math.floor((Math.random() * userData.items.length))];

    let oppoentId = usersData[e.target.value].id;
    let oppoentName = usersData[e.target.value].name;
    // pick randomr battler from Oppoent
    let oppoentBattler = usersData[e.target.value].items[Math.floor((Math.random() * usersData[e.target.value].items.length))];

    try {
      // Sends a PUT request to update users data for battle.
      const response = await fetch(`http://localhost:3001/api/battle?battler1=${playerBattler}&battler2=${oppoentBattler}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          playerId: playerId,
          playerBattler: playerBattler, 
          oppoentId: oppoentId,
          oppoentName: oppoentName,
          oppoentBattler: oppoentBattler, 
        }), 
      });
      if (response.ok) {
        const json = await response.json(); 
        alert(json.message); 
        onSetUserData(json.data);
      } else {
        console.log("Failed to update users."); // Throws an error if the response is not OK.
      }
    } catch (error) {
      console.error("Error occurred: ", error); // Logs an error message if the addition fails.
    }
      
  }

  // Fetch user data from Firestore when the component mounts
  useEffect(() => {
    async function fetchData() {
      const data = await fetchDataFromFirestore(); // Get user data from Firestore
      setUsersData(data); // Update state with the fetched user data
    }
    fetchData();
  }, [userData]); // Empty dependency array means this effect runs once on component mount

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-blue-100">
      <h1 className="text-2xl font-bold mb-4 text-red-800">
        Please keep a peaceful fighting environment
      </h1>
      {user ? (
        <div className="w-full lg:w-1/2 px-4">
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Users List</h2>
            {/* User cards grid */}
            <div className="space-y-4 text-black">
              {usersData.map((uData, userInd) => 
                uData.id != user.uid &&
                (<div key={uData.id} className="p-4 bg-gray-100 rounded-lg">
                    <p><strong>Name:</strong> {uData.name}</p>
                    <p><strong>Win:</strong> {uData.win}</p>
                    <p><strong>Draw:</strong> {uData.draw}</p>
                    <p><strong>Lose:</strong> {uData.lose}</p>
                    <ul className="flex  space-x-4">
                      {uData.items.map((rspItem, rspInd) => (
                        <li className="hover:text-gray-300 " key={rspInd}>{rspItem}</li>
                      ))}
                    </ul>
                    <button className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                    onClick={onClickBattle} value={userInd}>
                    Battle!
                    </button>
                </div>)
              )}
            </div>
          </div>
        </div>


      ) : (
        <p>Please log in to see the weather information.</p>
      )}

        <button className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
            <Link href="/">Home</Link>
        </button>
    </main>
  );
}
