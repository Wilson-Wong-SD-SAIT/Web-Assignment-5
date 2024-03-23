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
        console.log("Document has been written");
        return data;
      } catch (error: any) {
        console.error("Error occurred: ", error); // Logs an error message if the addition fails.
        return false; // Returns false to indicate that the document was not added due to an error.
      }
  }

export async function PATCH(req: NextRequest, { params }){

    try {
        const response = await fetch("https://rps101.pythonanywhere.com/api/v1/objects/all"); // Sends a GET request to the API.
        if (response.ok) {
            const json = await response.json();
            const item = json[Math.floor((Math.random() * 101))];
            const data = await addDataToFireStore( params.userId, item ); 
            return NextResponse.json({ item: item, data: data}, {status: 200});
        } else {
          console.log("Failed to fetch RSP API draw function."); // Throws an error if the response is not OK.
        }
      } catch (error: any) {
        console.error("Error occurred: ", error.message); // Logs an error message if the addition fails.
    }
}