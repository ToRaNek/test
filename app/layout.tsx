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
      <body className="min-h-screen bg-gray-950 text-white font-sans">
        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <header className="w-full p-6 bg-gray-900 shadow-lg border-b border-gray-800">
              <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                  <span className="mr-2">🎵</span> Devine la Zik
                </Link>
                <nav className="flex items-center gap-6">
                  {session?.user && (
                    <>
                      <Link href="/profile" className="hover:text-blue-400 transition-colors font-medium">
                        Profil
                      </Link>
                      <Link href="/lobby" className="hover:text-blue-400 transition-colors font-medium">
                        Lobby
                      </Link>
                    </>
                  )}
                  <ThemeToggle />
                </nav>
              </div>
            </header>
            <main className="flex-1 w-full max-w-4xl mx-auto p-8 mt-6 bg-gray-900 rounded-lg shadow-xl">
              {children}
            </main>
            <footer className="mt-12 py-6 text-center text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} Devine la Zik - Tous droits réservés</p>
            </footer>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
