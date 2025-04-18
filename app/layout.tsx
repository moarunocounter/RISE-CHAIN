import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Wallet Intel Lite",
  description: "Mini testnet wallet intel viewer",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
