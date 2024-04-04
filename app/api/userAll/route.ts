import { NextRequest, NextResponse } from "next/server";
import { db } from "../../firebase"; 
import { collection, getDocs  } from "firebase/firestore"; 

export async function GET(){

    try {
        const querySnapshot = await getDocs(collection(db, "users")); // Gets all documents from the 'users' collection
        const data = []; // Initialize an empty array to hold our user data
        querySnapshot.forEach((doc) => {
          // Loop through each document in the collection
          data.push({ id: doc.id, ...doc.data() }); // Add the document data (and its Firestore ID) to the data array
        });
        console.log("Document have been retrieved"); // Logs if creation is necessary.
        return NextResponse.json(data, {status: 200});
      } catch (error) {
        console.error("Error occurred: ", error); // Logs an error message if the addition fails.
        return NextResponse.json(null, { status: 500 });
      }
}

export const dynamic = 'force-dynamic'