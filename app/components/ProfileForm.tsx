"use client";
import { useState } from "react";
export function ProfileForm({ pseudo: initialPseudo, image: initialImage, onSubmit }: any) {
  const [pseudo, setPseudo] = useState(initialPseudo || "");
  const [image, setImage] = useState(initialImage || "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ pseudo, image });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        value={pseudo}
        onChange={e => setPseudo(e.target.value)}
        placeholder="Pseudo"
        autoFocus
      />
      <input
        type="text"
        value={image}
        onChange={e => setImage(e.target.value)}
        placeholder="Avatar (URL)"
      />
      <button className="bg-accent text-white py-2 rounded" type="submit">Mettre à jour</button>
    </form>
  );
}