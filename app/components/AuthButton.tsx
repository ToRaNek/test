'use client';
import { signIn } from 'next-auth/react';
export function AuthButton({ provider }: { provider: 'google' | 'discord' }) {
  const label = provider === 'google' ? 'Google' : 'Discord';
  return (
    <button
      onClick={() => signIn(provider)}
      className={'px-4 py-2 rounded bg-accent text-white shadow m-2'}
      aria-label={`Connexion ${label}`}
    >
      {`Se connecter avec ${label}`}
    </button>
  );
}
