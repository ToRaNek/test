'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSpotifyAuth } from '../../hooks/useSpotifyAuth';
import { SpotifyLinkButton } from '../../components/SpotifyLinkButton';
import { useProfile } from '../../hooks/useProfile';

export default function Profile() {
  const { data: session, status: sessionStatus } = useSession();
  const { profile, isLoading: profileLoading, error: profileError, update } = useProfile();
  const {
    spotifyLinked,
    isLoading: spotifyLoading,
    error: spotifyError,
    link: linkSpotify,
    unlink: unlinkSpotify,
  } = useSpotifyAuth();

  const [pseudo, setPseudo] = useState('');
  const [avatar, setAvatar] = useState('');
  const [msg, setMsg] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setPseudo(profile.pseudo || '');
      setAvatar(profile.image || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (formSubmitting) return;

    try {
      setFormSubmitting(true);
      setMsg('');

      const result = await update({ pseudo, image: avatar });

      if ('error' in result) {
        setMsg(result.error);
      } else {
        setMsg('Profil mis à jour avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setMsg('Erreur lors de la mise à jour du profil');
    } finally {
      setFormSubmitting(false);
    }
  };

  if (sessionStatus === 'loading' || profileLoading) {
    return <div className="animate-pulse">Chargement...</div>;
  }

  if (sessionStatus !== 'authenticated' || !session) {
    return <div>Veuillez vous connecter pour accéder à votre profil.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Profil</h2>
        <p className="text-gray-400 mt-1">Gérez votre profil et vos préférences</p>
      </div>

      <div className="p-6 bg-secondary rounded-lg shadow-sm">
        <h3 className="text-xl font-medium mb-4">Informations du profil</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="pseudo" className="block text-sm font-medium mb-1">
              Pseudo
            </label>
            <input
              id="pseudo"
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="3-25 caractères, unique"
              minLength={3}
              maxLength={25}
              className="w-full p-2 bg-primary border border-gray-700 rounded focus:ring-accent focus:border-accent"
            />
            <p className="text-xs text-gray-400 mt-1">
              Choisisez un pseudo unique de 3 à 25 caractères
            </p>
          </div>

          <div>
            <label htmlFor="avatar" className="block text-sm font-medium mb-1">
              Avatar (URL)
            </label>
            <input
              id="avatar"
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://exemple.com/avatar.jpg"
              className="w-full p-2 bg-primary border border-gray-700 rounded focus:ring-accent focus:border-accent"
            />
            <p className="text-xs text-gray-400 mt-1">Optionnel - URL vers une image</p>
          </div>

          <button
            onClick={handleSave}
            disabled={formSubmitting}
            className={`bg-accent text-white px-4 py-2 rounded hover:bg-accent/90 transition-colors ${
              formSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {formSubmitting ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </button>
        </div>
      </div>

      <div className="p-6 bg-secondary rounded-lg shadow-sm">
        <h3 className="text-xl font-medium mb-4">Liaison avec Spotify</h3>
        <p className="mb-4">
          {spotifyLinked
            ? '✅ Votre compte Spotify est lié. Vous pouvez utiliser vos playlists et recommandations.'
            : '❌ Vous devez lier votre compte Spotify pour jouer.'}
        </p>

        <SpotifyLinkButton
          linked={spotifyLinked}
          onLinkAction={linkSpotify}
          onUnlinkAction={unlinkSpotify}
          isLoading={spotifyLoading}
        />

        {spotifyError && <p className="text-red-500 mt-2">{spotifyError}</p>}
      </div>

      {(msg || profileError) && (
        <div
          className={`p-4 rounded ${msg.includes('succès') ? 'bg-green-800/20 text-green-200' : 'bg-red-800/20 text-red-200'}`}
        >
          {msg || profileError}
        </div>
      )}
    </div>
  );
}
