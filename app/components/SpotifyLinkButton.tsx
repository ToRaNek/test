'use client';
import { useState } from 'react';

interface SpotifyLinkButtonProps {
  linked: boolean;
  onLinkAction: () => Promise<void>;
  onUnlinkAction: () => Promise<void>;
  isLoading?: boolean;
}

export function SpotifyLinkButton({
  linked,
  onLinkAction,
  onUnlinkAction,
  isLoading = false,
}: SpotifyLinkButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      if (linked) {
        await onUnlinkAction();
      } else {
        await onLinkAction();
      }
    } catch (error) {
      console.error("Erreur lors de l'action Spotify:", error);
    } finally {
      setLoading(false);
    }
  };

  const buttonDisabled = loading || isLoading;
  const buttonText = loading
    ? linked
      ? 'Déliaison en cours...'
      : 'Liaison en cours...'
    : linked
      ? 'Délier Spotify'
      : 'Lier mon compte Spotify';

  return (
    <button
      onClick={handleAction}
      disabled={buttonDisabled}
      className={`px-4 py-2 rounded transition-colors ${
        linked
          ? 'bg-red-600 hover:bg-red-700 text-white'
          : 'bg-accent hover:bg-accent/90 text-white'
      } ${buttonDisabled ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {buttonText}
    </button>
  );
}
