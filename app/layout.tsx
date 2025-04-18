import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Rise Explorer",
  description: "Mini wallet explorer for Rise Testnet",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0e0f11] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
