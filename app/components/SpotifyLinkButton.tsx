"use client";
export function SpotifyLinkButton({ linked, onLink, onUnlink }: any) {
  return linked ? (
    <button onClick={onUnlink} className="bg-red-600 text-white px-4 py-2 rounded">
      Délier Spotify
    </button>
  ) : (
    <button onClick={onLink} className="bg-accent text-white px-4 py-2 rounded">
      Lier mon compte Spotify
    </button>
  );
}