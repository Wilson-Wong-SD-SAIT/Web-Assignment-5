"use client"; // This directive indicates that we're using this file in a client-side environment.

import React from 'react';
import { useUserAuth } from "../app/auth-context";

export default function Rsp() {
  const { userData } = useUserAuth();

  return (
    <div className="container mx-auto bg-gray-800 text-white py-4">
        {userData && 
          (<div className="flex flex-col">
            <p className="px-4"><strong>Name:</strong> {userData.name}</p>
            <p className="px-4"><strong>Win:</strong> {userData.win}</p>
            <p className="px-4"><strong>Draw:</strong> {userData.draw}</p>
            <p className="px-4"><strong>Lose:</strong> {userData.lose}</p>
            <ul className="flex justify-center space-x-4">
              {userData.items.map((rspItem, index) => (
                <li className="hover:text-gray-300" key={index}>{rspItem}</li>
              ))}
            </ul>
          </div>)
        }
    </div>
  );
}
