import { NextRequest, NextResponse } from "next/server";

import { db } from "../../../firebase"; 
import { doc, setDoc, getDoc } from "firebase/firestore"; 

export async function PUT(req: NextRequest, { params }){

    const userInfo = await req.json();
    try {
      const data = {
        name: userInfo.name,
        email: userInfo.email,
        items: [],
        win: 0,
        draw: 0,
        lose: 0,
      };
        await setDoc(doc(db, "users", params.userId), data);
        console.log(`Document ${params.userId} has been created`); // Logs the ID of the new document if addition is successful.
        return NextResponse.json(data, {status: 200});
      } catch (error) {
        console.error("Error occurred: ", error); // Logs an error message if the addition fails.
        return NextResponse.json({ data: null }, { status: 500 });
      }
}

export async function GET(req: NextRequest, { params }){

    try {
        const docSnap = await getDoc(doc(db, "users", params.userId));
        if (docSnap.exists()) {
          const data = await docSnap.data();
          console.log(`Document ${docSnap.id} has been retrieved`); // Logs the ID if retrieval is successful.
          return NextResponse.json({exist: true, ...data}, {status: 200});
        } else {
          console.log("Document need to be created"); // Logs if creation is necessary.
          return NextResponse.json({exist: false}, {status: 200});
        }
      } catch (error) {
        console.error("Error occurred: ", error); // Logs an error message if the addition fails.
        return NextResponse.json(null, { status: 500 });
      }
}