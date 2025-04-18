import "../globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Rise Explorer",
  description: "Simple wallet and tx explorer for Rise chain",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0e0f11] text-white">{children}</body>
    </html>
  );
}
