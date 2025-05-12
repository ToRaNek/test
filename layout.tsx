import React from "react";
import "../styles/globals.css";
import ThemeToggle from "../components/ThemeToggle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-primary text-white min-h-screen">
        <nav className="flex justify-between items-center p-4">
          <span className="text-xl font-bold">Devine la Zik</span>
          <ThemeToggle />
        </nav>
        <main className="max-w-3xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}