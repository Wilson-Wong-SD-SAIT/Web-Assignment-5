import { NextRequest, NextResponse } from "next/server";

import { db } from "../../../firebase"; 
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"; 

async function addDataToFireStore(uid, item) {

    try {
        await updateDoc(doc(db, "users", uid), {
            items: arrayUnion(item),
          });
        const querySnapshot = await getDoc(doc(db, "users", uid));
        const data = await querySnapshot.data();
        console.log(`Document ${uid} has been written`); // Logs id if update is successful.
        return data;
        
      } catch (error: any) {
        console.error(`Failed to update user ${uid}.`, error.message); // Logs an error message if update is unsuccessful.
        throw new Error(error.message, error); // Throws the error for API response.
      }
  }

export async function PATCH(req: NextRequest, { params }){

    try {
        // get 101 RSP items
        const response = await fetch("https://rps101.pythonanywhere.com/api/v1/objects/all"); // Sends a GET request to the API.
        if (response.ok) {
            const json = await response.json();

            // draw 1 from 101 RSP items
            const item = json[Math.floor((Math.random() * 101))];

            // add draw item for user in Firebase
            const data = await addDataToFireStore( params.userId, item ); 
            return NextResponse.json({ item: item, data: data}, {status: 200});
        } else {
          throw new Error("Failed to fetch RSP API draw function."); // Throws the error if the response is not OK.
        }
      } catch (error: any) {
        console.error("Error occurred: ", error.message); // Logs an error message if the Patch fails.
        return NextResponse.json({ message: "Internal Server Error: " + error.message, data: null }, { status: 500 });
    }
}