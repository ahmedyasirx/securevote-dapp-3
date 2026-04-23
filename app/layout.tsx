import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SecureVote DApp",
  description: "A blockchain voting system built by modifying jellydn/dapp-starter."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
