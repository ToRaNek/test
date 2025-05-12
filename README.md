# 🎶 Devine la Zik V2

Application web Next.js + Typescript pour jouer à "Devine la Zik" avec login Google/Discord, liaison Spotify obligatoire, parties multi-joueurs, full REST API, scalable.

---

## ⚙️ Stack technique

- **Frontend** : Next.js 13+, React 18, TailwindCSS, Zustand, React Query
- **Backend** : Next.js API Routes, NextAuth.js v4 (Google, Discord, liaison Spotify), Prisma ORM (PostgreSQL), possible Redis (optionnel pour cache/sync)
- **Tests** : Jest (unitaires/intégration)
- **Linter/Format** : ESLint, Prettier, conventions strictes

---

## 🚀 Installation rapide

### 1. Cloner et installer

```bash
git clone https://github.com/ton-projet/devine-la-zik.git
cd devine-la-zik
pnpm install        # ou npm install
```

### 2. Préparer l'environnement

Remplir `.env` et `/prisma/.env` (voir `.env.example` si fourni) :

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
NEXTAUTH_SECRET=changer
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback
```

### 3. Lancer la base et migrer

```bash
pnpm prisma:migrate
```

*(Pour peupler la base en démo :)*

```bash
pnpm prisma:seed
```

### 4. Dev local

```bash
pnpm dev
# accès sur http://localhost:3000/
```

---

## 💡 Features principales

- Auth uniquement Google/Discord (NextAuth v4)
- Liaison Spotify obligatoire après login, jamais côté provider principal d'auth
- Parties, rooms, player/score, quiz audio génération via API Spotify
- Séparation stricte back/front, aucune donnée sensible côté client
- 100% TypeScript, code modulaire et prêt à scale
- REST API sécurisée, validation forte (Zod)
- UX moderne, responsive, accessibilité minimale, dark/light mode

---

## 📂 Structure projet

```
/app
  /api           # Backend REST (profil, spotify, game, etc.)
  /components    # Composants UI réutilisables
  /hooks         # Hooks custom React/Zustand
  /store         # State management
  /styles        # CSS globaux et config tailwind
/prisma
  schema.prisma  # Schéma DB
  seed.ts        # Script de seed (données démo)
.env
/README.md
```

---

## 🛂 Commandes utiles

- **Dev** : `pnpm dev`
- **Build** : `pnpm build`
- **Test** : `pnpm test`
- **Migration Prisma** : `pnpm prisma:migrate`
- **Seed** : `pnpm prisma:seed`
- **Lint/Format** : `pnpm lint && pnpm format`

---

## 🔒 Sécurité & bonnes pratiques

- Jamais de token Spotify côté client (frontend)
- Tous les endpoints `/api` protégés (NextAuth session requise)
- Validation forte (Zod) côté API et UI
- RGPD : suppression de compte et droit à l'oubli possible (endpoints prévus)

---

## ❓ Pour aller plus loin

- Si tu veux socket/temps réel (SSE/Socket.io), prévoir plugin dans `/backend`
- Ajoute des tests Playwright/Jest pour les endpoints ou composants critiques

---

**Prêt à jouer ?**  
Connecte-toi, lie ton Spotify, crée une partie, invite tes amis, et devine la zik !  
**Contribs et feedbacks bienvenus.**