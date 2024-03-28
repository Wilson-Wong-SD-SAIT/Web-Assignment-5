import { NextRequest, NextResponse } from "next/server";
import { db } from "../../firebase"; 
import {  doc, getDoc, updateDoc, arrayRemove, arrayUnion, increment  } from "firebase/firestore"; 

async function updateToFireStore(uid, battler, result) {
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

      console.log(`Document ${uid} has been written`); // Logs id if update is successful.
    } catch (error: any) {
      console.error(`Failed to update user ${uid}.`, error.message); // Logs an error message if update is unsuccessful.
      throw new Error(error.message, error); // Throws the error for API response.
    }
}

async function getDataFromFireStore(uid) {
    try {
        const querySnapshot = await getDoc(doc(db, "users", uid));
        const data = await querySnapshot.data();
        console.log(`Document ${uid} has been retrieved`); // Logs id if get is successful.
        return data;
    } catch (error: any) {
        console.error(`Failed to get user ${uid}.`, error.message); // Logs an error message if update is unsuccessful.
        throw new Error(error.message, error); // Throws the error for API response.
    }
}

export async function PATCH(req: NextRequest){

    const { 
      playerId,
      playerBattler, 
      oppoentId,
      oppoentName,
      oppoentBattler, 
    } = await req.json();

    try {
        const response = await fetch(`https://rps101.pythonanywhere.com/api/v1/match?object_one=${playerBattler}&object_two=${oppoentBattler}`); // Sends a GET request to the API.
    
        if (response.ok) {
            const json = await response.json();
            const {winner, outcome, loser} = json;
            let message = "";

            // Update database and result message according to API response
            if(winner == playerBattler){
                await updateToFireStore(playerId, winner, "win");
                await updateToFireStore(oppoentId, loser, "lose");
                message = `Your ${playerBattler} ${outcome} ${oppoentName}'s ${oppoentBattler}`;
              } else if( winner == oppoentBattler) {
                await updateToFireStore(playerId, loser, "lose");
                await updateToFireStore(oppoentId, winner, "win");
                message = `${oppoentName}'s ${oppoentBattler} ${outcome} your ${playerBattler}`;
              } else {
                await updateToFireStore(playerId, null, "draw");
                await updateToFireStore(oppoentId, null, "draw");
                message = `Your ${playerBattler} vs ${oppoentName}'s ${oppoentBattler}. It's a draw.`;
            }

            // Reply updated user data and result message
            const data = await getDataFromFireStore(playerId);
            return NextResponse.json({message: message, data: data}, {status: 200});

        } else {
          throw new Error("Failed to fetch RSP API battle function."); // Throws the error if the response is not OK.
        }
      } catch (error: any) {
        console.error("Error occurred: ", error.message); // Logs an error message if the Patch fails.
        return NextResponse.json({ message: "Internal Server Error: " + error.message, data: null }, { status: 500 });
    }
}