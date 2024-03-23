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

      console.log("Document has been written"); // Logs the ID of the new document if addition is successful.
      return true; // Returns true to indicate that the document was successfully added.
    } catch (error: any) {
      console.error("Error occurred: ", error); // Logs an error message if the addition fails.
      return false; // Returns false to indicate that the document was not added due to an error.
    }
}

async function getDataFromFireStore(uid) {

    try {
        const querySnapshot = await getDoc(doc(db, "users", uid));
        const data = await querySnapshot.data();
        return data;
    } catch (error: any) {
        console.error("Error occurred: ", error.message); // Logs an error message if the addition fails.
        return false; // Returns false to indicate that the document was not added due to an error.
    }
}

export async function PATCH(req: NextRequest){

    const battleInfo = await req.json();
    //const battler1 = req.nextUrl.searchParams.get('battler1');
    //const battler2 = req.nextUrl.searchParams.get('battler2');

    try {
        const response = await fetch(`https://rps101.pythonanywhere.com/api/v1/match?object_one=${battleInfo.playerBattler}&object_two=${battleInfo.oppoentBattler}`) ; // Sends a GET request to the API.
    
        if (response.ok) {
            const json = await response.json();
            const {winner, outcome, loser} = json;
        
            let message = "";
            if(winner == battleInfo.playerBattler){
                await updateToFireStore(battleInfo.playerId, winner, "win");
                await updateToFireStore(battleInfo.oppoentId, loser, "lose");
                message = `Your ${battleInfo.playerBattler} ${outcome} ${battleInfo.oppoentName}'s ${battleInfo.oppoentBattler}`;
              } else if( winner == battleInfo.oppoentBattler) {
                await updateToFireStore(battleInfo.playerId, loser, "lose");
                await updateToFireStore(battleInfo.oppoentId, winner, "win");
                message = `${battleInfo.oppoentName}'s ${battleInfo.oppoentBattler} ${outcome} your ${battleInfo.playerBattler}`;
              } else {
                await updateToFireStore(battleInfo.playerId, null, "draw");
                await updateToFireStore(battleInfo.oppoentId, null, "draw");
                message = `Your ${battleInfo.playerBattler} vs ${battleInfo.oppoentName}'s ${battleInfo.oppoentBattler}. It's a draw.`;
            }

            const data = await getDataFromFireStore(battleInfo.playerId);
            return NextResponse.json({message: message, data: data}, {status: 200});

        } else {
          console.log("Failed to fetch RSP API battle function."); // Throws an error if the response is not OK.
        }
      } catch (error: any) {
        console.error("Error occurred: ", error.message); // Logs an error message if the addition fails.
    }

}