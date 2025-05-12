# 📁 Architecture Devine la Zik — Next.js 13+/Typescript (AppDir)

```
/app
  /(public)
    /login
    /profile
    /lobby
    /room/[roomCode]
    /game/[gameId]
    /results/[gameId]
  /api
    /auth/[...nextauth].ts
    /profile.ts
    /spotify
      /link.ts
      /unlink.ts
    /music
      /playlists.ts
      /preferences.ts
    /room
      /index.ts
      /[code]/join.ts
    /game
      /start.ts
      /state.ts
      /answer.ts
      /results.ts
  /components
    AuthButton.tsx
    ProfileForm.tsx
    SpotifyLinkButton.tsx
    Lobby.tsx
    Room.tsx
    Game.tsx
    Results.tsx
    ThemeToggle.tsx
    UserAvatar.tsx
    ...
  /hooks
    useSpotifyAuth.ts
    useProfile.ts
    useLobby.ts
    useRoom.ts
    ...
  /store
    useUserStore.ts
    useLobbyStore.ts
    useGameStore.ts
  /styles
    globals.css
    tailwind.config.js
  /utils
    auth.ts
    api.ts
    validate.ts
    spotify.ts
    ...
/prisma
  schema.prisma
  seed.ts
/.env
/next.config.js
/tailwind.config.js
/tsconfig.json
/prisma/.env
/.eslintrc.js
/.prettierrc
/jest.config.js
/package.json
/README.md
```

**Principes structurants :**

- `app/` (Next.js AppDir) : pages, routing, API.
- `prisma/` : ORM schema & seed.
- `components/` : React components réutilisables.
- `hooks/`, `store/` : State management custom (Zustand, React Query…).
- `api/` : All back routes (RESTful), toutes protégées.
- TypeScript partout, validation (Zod), style Tailwind, accessibilité.

---
