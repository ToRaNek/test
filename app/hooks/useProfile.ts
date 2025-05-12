'use client';
import { useState, useEffect } from 'react';
import { User } from '../types';

interface ProfileUpdate {
  pseudo: string;
  image?: string;
}

interface UseProfileReturn {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
  update: (data: ProfileUpdate) => Promise<User | { error: string }>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger le profil au montage du composant
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/profile');

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setProfile(data);
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        setError('Impossible de charger le profil.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Mettre à jour le profil
  const update = async (data: ProfileUpdate): Promise<User | { error: string }> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Mettre à jour le state local avec les nouvelles données
        setProfile((prevProfile) => ({ ...prevProfile, ...data }) as User);
        setError(null);
        return result;
      } else {
        setError(result.error || 'Erreur lors de la mise à jour du profil');
        return { error: result.error || 'Erreur lors de la mise à jour du profil' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { profile, isLoading, error, update };
}
