"use client";

interface SpotifyLinkButtonProps {
    linked: boolean;
    onLinkAction: () => Promise<void>;
    onUnlinkAction: () => Promise<void>;
}

export function SpotifyLinkButton({ linked, onLinkAction, onUnlinkAction }: SpotifyLinkButtonProps) {
    return linked ? (
        <button
            onClick={onUnlinkAction}
            className="bg-red-600 text-white px-4 py-2 rounded"
        >
            Délier Spotify
        </button>
    ) : (
        <button
            onClick={onLinkAction}
            className="bg-accent text-white px-4 py-2 rounded"
        >
            Lier mon compte Spotify
        </button>
    );
}