import { Inter } from "next/font/google";
import "./globals.css";
import ButtonNav from "@/component/bottomnav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Roadmapper",
  description: "A rouadMapper Demo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <h1>RoadMapr</h1>
        {children}
        <ButtonNav/>  
      </body>
    </html>
  );
}
