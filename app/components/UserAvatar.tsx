// app/components/UserAvatar.tsx
import React from "react";
import Image from "next/image";

export function UserAvatar({ src, pseudo }: { src?: string; pseudo: string }) {
  if (src) return <Image src={src} alt={pseudo} className="rounded-full" width={40} height={40} />;
  return <span className="rounded-full w-10 h-10 bg-accent flex items-center justify-center text-white">{pseudo[0]}</span>;
}