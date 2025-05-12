// /utils/env.ts
export const env = {
  NEXTAUTH_SECRET: required("NEXTAUTH_SECRET"),
  GOOGLE_CLIENT_ID: required("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: required("GOOGLE_CLIENT_SECRET"),
  DISCORD_CLIENT_ID: required("DISCORD_CLIENT_ID"),
  DISCORD_CLIENT_SECRET: required("DISCORD_CLIENT_SECRET"),
  DATABASE_URL: required("DATABASE_URL"),
  SPOTIFY_CLIENT_ID: required("SPOTIFY_CLIENT_ID"),
  SPOTIFY_CLIENT_SECRET: required("SPOTIFY_CLIENT_SECRET"),
  SPOTIFY_REDIRECT_URI: required("SPOTIFY_REDIRECT_URI"),
};

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value;
}