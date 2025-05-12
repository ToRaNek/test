// types/next-auth.d.ts
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Retourné par `useSession', `getSession` et reçu comme prop dans `SessionProvider`
   */
  interface Session {
    user: {
      /** L'ID de l'utilisateur dans la base de données */
      id: string;
      /** Le pseudo de l'utilisateur (peut être null) */
      pseudo: string | null;
    } & DefaultSession['user'];
  }

  /**
   * La forme de l'objet utilisateur dans les callbacks
   */
  interface User {
    id: string;
    pseudo?: string | null;
  }
}

declare module 'next-auth/jwt' {
  /** Retourné par la fonction `jwt` callback */
  interface JWT {
    id: string;
    pseudo?: string | null;
  }
}
