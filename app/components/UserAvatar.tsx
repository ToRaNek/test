import React from "react";
export function UserAvatar({ src, pseudo }: { src?: string; pseudo: string }) {
  if (src) return <img src={src} alt={pseudo} className="rounded-full w-10 h-10" />;
  return <span className="rounded-full w-10 h-10 bg-accent flex items-center justify-center text-white">{pseudo[0]}</span>;
}