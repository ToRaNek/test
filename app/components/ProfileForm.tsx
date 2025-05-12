'use client';
import { useState, FormEvent } from 'react';

interface ProfileFormProps {
  pseudo?: string | null;
  image?: string | null;
  onSubmitAction: (data: { pseudo: string; image: string }) => Promise<void>;
}

export function ProfileForm({
  pseudo: initialPseudo,
  image: initialImage,
  onSubmitAction,
}: ProfileFormProps) {
  const [pseudo, setPseudo] = useState(initialPseudo || '');
  const [image, setImage] = useState(initialImage || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmitAction({ pseudo, image });
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="pseudo" className="text-sm text-gray-300">
        Pseudo (3-25 caractères)
      </label>
      <input
        id="pseudo"
        type="text"
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
        placeholder="Pseudo"
        autoFocus
        className="p-2 bg-secondary rounded"
        minLength={3}
        maxLength={25}
        pattern="^[a-zA-Z0-9_-]+$"
        required
      />

      <label htmlFor="image" className="text-sm text-gray-300 mt-2">
        Avatar URL (optionnel)
      </label>
      <input
        id="image"
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="https://exemple.com/image.jpg"
        className="p-2 bg-secondary rounded"
      />

      <button
        className="bg-accent text-white py-2 rounded mt-4"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
      </button>
    </form>
  );
}
