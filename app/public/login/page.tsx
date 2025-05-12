'use client';
import { signIn } from 'next-auth/react';

export default function Login() {
  return (
    <div className="min-h-[60vh] flex flex-col gap-5 justify-center items-center">
      <h2 className="text-2xl font-bold">Connexion</h2>
      <button
        className="bg-white text-black rounded px-4 py-2 shadow hover:bg-gray-100"
        onClick={() => signIn('google')}
        aria-label="Connexion Google"
      >
        Se connecter avec Google
      </button>
      <button
        className="bg-indigo-500 text-white rounded px-4 py-2 shadow hover:bg-indigo-600"
        onClick={() => signIn('discord')}
        aria-label="Connexion Discord"
      >
        Se connecter avec Discord
      </button>
      <p className="text-xs text-gray-400 mt-4">
        Aucune inscription directe — Auth Google/Discord obligatoire
      </p>
    </div>
  );
}
