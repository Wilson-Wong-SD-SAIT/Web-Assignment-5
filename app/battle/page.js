"use client"; // This directive indicates that we're using this file in a client-side environment.

import React, { useState, useEffect } from "react";
import { useUserAuth } from "../auth-context"; // Adjust the path as needed
import Link from "next/link";
import { unstable_noStore as noStore } from 'next/cache';

// Asynchronously fetches user data from Firestore
async function fetchDataFromFirestore() {
  try {
    // Sends a GET request to get all user data.
    const response = await fetch(`/api/userAll/`, { cache: 'no-store' });
    if (response.ok) {
      const json = await response.json(); 
      return json;
    } else {
      throw new Error("Failed to call API fetch all users data."); // Throws an error if the response is not OK.
    }
  } catch (error) {
    console.error("Error occurred: ", error.message); // Logs an error message if the addition fails.
    return []; // Returns empty array to indicate that no user was loaded due to an error.
  }
}

export default function Battle() {
  // disable vercel cache to prevent non-reloading usersData
  noStore();

  // State variables for the component
  const [usersData, setUsersData] = useState([]); // Holds array of user data fetched from Firestore
  const { user, userData, onSetUserData } = useUserAuth(); // Assume no need for firebaseSignOut directly here unless a logout feature on this page is desired


  async function fetchData() {
    const data = await fetchDataFromFirestore(); // Get user data from Firestore
    setUsersData(data); // Update state with the fetched user data
  }

  async function onClickBattle(e) {
    // prevent user to battle without battler
    if (userData.items.length == 0) {
      alert("You don't have any battler. Draw first.")
      return;
    }
    // prevent Opponent to battle without battler
    if (usersData[e.target.value].items.length == 0) {
      alert("Opponent don't have any battler. Let it go.")
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
      // Sends a PATCH request to update users data for battle.
      const response = await fetch(`/api/battle`, {
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
        setUsersData(await fetchDataFromFirestore());   
      } else {
        throw new Error("Failed to call API battle."); // Throws an error if the response is not OK.
      }
    } catch (error) {
      console.error("Error occurred: ", error); // Logs an error message if the battle fails.
    }
      
  }



  // Fetch user data from Firestore when the component mounts
  useEffect(() => {
    fetchData();
  },[userData]); // Re-render component if user data changed after battle 

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-blue-100">
      <p className="text-2xl font-bold mb-4 text-red-400">Let knock out oppoent's Rock-Scissors-Paper!</p>
      {user ? (
        <div className="w-full lg:w-1/2 px-4">
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Users List</h2>
            {/* Opponent grid */}
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
        <p>Please log in to play RSP game.</p>
      )}

        <button className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
            <Link href="/">Home</Link>
        </button>
    </main>
  );
}


