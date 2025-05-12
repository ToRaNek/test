// app/components/ThemeToggle.tsx
"use client";
import React from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Montrer le composant uniquement après le premier rendu côté client
    // pour éviter les erreurs d'hydratation
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <button className="rounded p-2 bg-secondary hover:bg-accent focus:outline-none w-9 h-9" />;
    }

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            aria-label="Changer thème"
            className="rounded p-2 bg-secondary hover:bg-accent focus:outline-none"
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
            {isDark ? "🌙" : "☀️"}
        </button>
    );
}