import { NextRequest, NextResponse } from "next/server";

import { db } from "../../../firebase"; 
import { doc, setDoc, getDoc } from "firebase/firestore"; 

export async function PUT(req: NextRequest, { params }){

    const userInfo = await req.json();
    try {
        await setDoc(doc(db, "users", params.userId), {
            name: userInfo.name,
            email: userInfo.email,
            items: [],
            win: 0,
            draw: 0,
            lose: 0,
          });
        console.log("Document has been created"); // Logs the ID of the new document if addition is successful.
        const docSnap = await getDoc(doc(db, "users", params.userId));
        const data = await docSnap.data();
        return NextResponse.json(data, {status: 200});
      } catch (error) {
        console.error("Error occurred: ", error); // Logs an error message if the addition fails.
        return false; // Returns false to indicate that the document was not added due to an error.
      }
}

export async function GET(req: NextRequest, { params }){

    try {
        const docSnap = await getDoc(doc(db, "users", params.userId));
        
        if (docSnap.exists()) {
          const data = await docSnap.data();
          console.log("Document has been retrieved"); // Logs the ID of the new document if addition is successful.
          return NextResponse.json({exist: true, ...data}, {status: 200});
        } else {
          console.log("Document need to be created"); // Logs the ID of the new document if addition is successful.
          return NextResponse.json({exist: false}, {status: 200});
        }
      } catch (error) {
        console.error("Error occurred: ", error); // Logs an error message if the addition fails.
        return false; // Returns false to indicate that the document was not added due to an error.
      }
}