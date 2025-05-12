// app/layout.tsx
import React from "react";
import "./styles/globals.css";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "./app/components/ThemeToggle";
import { SessionProvider } from "./app/components/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./app/api/auth/[...nextauth]";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="fr" suppressHydrationWarning>
        <body className="bg-primary text-white min-h-screen">
        <SessionProvider session={session}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                <nav className="flex justify-between items-center p-4">
                    <span className="text-xl font-bold">Devine la Zik</span>
                    <ThemeToggle />
                </nav>
                <main className="max-w-3xl mx-auto p-4">{children}</main>
            </ThemeProvider>
        </SessionProvider>
        </body>
        </html>
    );
}