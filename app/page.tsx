// app/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Si utilisateur non connecté, rediriger vers login
  if (!session?.user) {
    redirect('/public/login');
  }

  // Utilisateur connecté, rediriger vers lobby
  redirect('/public/lobby');
}
