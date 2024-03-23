"use client"; // This directive indicates that we're using this file in a client-side environment.

import React, { useState, useEffect } from "react";
import { useUserAuth } from "../auth-context"; // Adjust the path as needed
import Link from "next/link";
import { db } from "@/app/firebase"; // Your custom Firebase configuration
import { collection, doc, getDoc, getDocs, updateDoc, arrayUnion, arrayRemove, increment  } from "firebase/firestore"; 

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

  async function fetchData() {
    const data = await fetchDataFromFirestore(); // Get user data from Firestore
    setUsersData(data); // Update state with the fetched user data
  }
  
  const fetchBattle = (battler1, battler2) => 
    fetch(`https://rps101.pythonanywhere.com/api/v1/match?object_one=${battler1}&object_two=${battler2}`) 
    .then(response => response.json());
  
  async function updateToFireStore(uid, result, battler) {
    try {
      if(result == "win"){
        await updateDoc(doc(db, "users", uid), {
          win: increment(1),
          items: arrayUnion(battler),
        });
      } else if(result == "draw") {
        await updateDoc(doc(db, "users", uid), {
          draw: increment(1),
        });
      } else {
        await updateDoc(doc(db, "users", uid), {
          lose: increment(1),
          items: arrayRemove(battler),
        });
      }

      console.log("Document has been written"); // Logs the ID of the new document if addition is successful.
      return true; // Returns true to indicate that the document was successfully added.
    } catch (error) {
      console.error("Error occurred: ", error); // Logs an error message if the addition fails.
      return false; // Returns false to indicate that the document was not added due to an error.
    }
  }


  async function onClickBattle(e) {
    if (userData.items.length == 0) {
      alert("You don't have any battler. Draw first.")
      return;
    }
    // pick randomr battler from User
    let battler1 = userData.items[Math.floor((Math.random() * userData.items.length))];
    // pick randomr battler from Oppoent
    let battler2 = usersData[e.target.value].items[Math.floor((Math.random() * usersData[e.target.value].items.length))];

    const {winner, outcome, loser} = await fetchBattle(battler1, battler2);

    let oppoent = usersData[e.target.value].name + "'s";
    try {
      if(winner == battler1){
        await updateToFireStore(user.uid, "win", battler1);
        await updateToFireStore(usersData[e.target.value].id, "lose", battler2);
        alert(`Your ${winner} ${outcome} ${oppoent} ${loser}`);
      } else if( winner == battler2) {
        await updateToFireStore(user.uid, "lose", battler1);
        await updateToFireStore(usersData[e.target.value].id, "win", battler2);
        alert(`${oppoent} ${winner} ${outcome} your ${loser}`);
      } else {
        await updateToFireStore(user.uid, "draw", null);
        await updateToFireStore(usersData[e.target.value].id, "draw");
        alert(`Your ${battler1} vs ${oppoent} ${battler2}. It's a draw.`);
      }

      // update userData in context
      const querySnapshot = await getDoc(doc(db, "users", user.uid));
      onSetUserData(querySnapshot.data());

      // Fetch all user data from Firestore
      fetchData(); 

      console.log("Document has been written"); // Logs the ID of the new document if addition is successful.
      return true; // Returns true to indicate that the document was successfully added.
    } catch (error) {
      console.error("Error occurred: ", error); // Logs an error message if the addition fails.
      return false; // Returns false to indicate that the document was not added due to an error.
    }
  }

  // Fetch user data from Firestore when the component mounts
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this effect runs once on component mount

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
