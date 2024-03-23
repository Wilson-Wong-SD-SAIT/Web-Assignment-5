import { Inter } from "next/font/google";
import "./globals.css";

import { AuthContextProvider } from "./auth-context";
import Header from "../components/header";
import Rsp from "../components/rsp";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "101 RSP battle!",
  description: "Interactive Rock-Scissors-Paper online game",
};

export default function RootLayout({ children }) {
  return (
    <AuthContextProvider>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          {children}
          <Rsp/>
        </body>
      </html>
    </AuthContextProvider>
  );
}
