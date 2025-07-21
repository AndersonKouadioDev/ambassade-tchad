'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLocale } from 'next-intl';

interface AuthProtectionProps {
  children: React.ReactNode;
}

export default function AuthProtection({ children }: AuthProtectionProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    // Si le statut est "loading", on attend
    if (status === 'loading') return;

    // Si pas de session, rediriger vers la page de login
    if (!session) {
      console.log('Utilisateur non authentifié, redirection vers /auth');
      router.push(`/${locale}/auth`);
      return;
    }

    console.log('Utilisateur authentifié:', session.user?.email);
  }, [session, status, router, locale]);

  // Pendant le chargement, afficher un loader
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si pas de session, ne rien afficher (redirection en cours)
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  // Si authentifié, afficher le contenu protégé
  return <>{children}</>;
} 