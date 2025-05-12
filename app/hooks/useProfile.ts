import { useState, useEffect } from "react";
export function useProfile() {
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    fetch("/api/profile").then((r) => r.json()).then(setProfile);
  }, []);
  const update = async (data: any) => {
    const r = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const res = await r.json();
    setProfile(p => ({ ...p, ...data }));
    return res;
  };
  return { profile, update };
}