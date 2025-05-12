// utils/env.ts
/**
 * Charge et valide les variables d'environnement requises
 */
export const env = {
  DATABASE_URL: required('DATABASE_URL'),
  DIRECT_URL: required('DIRECT_URL'),
  NEXTAUTH_URL: required('NEXTAUTH_URL'),
  NEXTAUTH_SECRET: required('NEXTAUTH_SECRET'),
  GOOGLE_CLIENT_ID: required('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: required('GOOGLE_CLIENT_SECRET'),
  DISCORD_CLIENT_ID: required('DISCORD_CLIENT_ID'),
  DISCORD_CLIENT_SECRET: required('DISCORD_CLIENT_SECRET'),
  SPOTIFY_CLIENT_ID: required('SPOTIFY_CLIENT_ID'),
  SPOTIFY_CLIENT_SECRET: required('SPOTIFY_CLIENT_SECRET'),
  SPOTIFY_REDIRECT_URI: required('SPOTIFY_REDIRECT_URI'),
};

/**
 * Vérifie qu'une variable d'environnement requise est définie
 * @param key Nom de la variable d'environnement
 * @returns Valeur de la variable d'environnement
 * @throws Error si la variable n'est pas définie
 */
function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Variable d'environnement requise manquante: ${key}`);
  }
  return value;
}
