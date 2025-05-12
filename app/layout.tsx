// app/layout.tsx
import React from 'react';
import './styles/globals.css';
import { ThemeProvider } from 'next-themes';
import ThemeToggle from './components/ThemeToggle';
import { SessionProvider } from './components/SessionProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Link from 'next/link';

export const metadata = {
  title: 'Devine la Zik',
  description: 'Application musicale collaborative avec Spotify',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <nav className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
              <Link href="/" className="text-xl font-bold flex items-center">
                <span className="mr-2">🎵</span> Devine la Zik
              </Link>
              <div className="flex items-center gap-4">
                {session?.user && (
                  <>
                    <Link href="/profile" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                      Profil
                    </Link>
                    <Link href="/lobby" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                      Lobby
                    </Link>
                  </>
                )}
                <ThemeToggle />
              </div>
            </nav>
            <main className="max-w-3xl mx-auto p-4">{children}</main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
