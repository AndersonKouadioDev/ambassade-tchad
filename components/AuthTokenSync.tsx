'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

export default function AuthTokenSync() {
  const { data: session, status } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      // Calculer le temps restant avant expiration (8 heures = 28800000 ms)
      const sessionDuration = 8 * 60 * 60 * 1000; // 8 heures en millisecondes
      const warningTime = 5 * 60 * 1000; // Avertissement 5 minutes avant expiration
      
      // Calculer le temps écoulé depuis la création de la session
      const sessionStart = session.user?.iat ? session.user.iat * 1000 : Date.now();
      const timeElapsed = Date.now() - sessionStart;
      const timeRemaining = sessionDuration - timeElapsed;
      
      // Nettoyer les timeouts précédents
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

      // Afficher un avertissement 5 minutes avant expiration
      if (timeRemaining > warningTime) {
        warningTimeoutRef.current = setTimeout(() => {
          toast.warning(
            'Votre session expire dans 5 minutes. Veuillez sauvegarder votre travail.',
            {
              autoClose: false,
              closeOnClick: false,
              draggable: false,
            }
          );
        }, timeRemaining - warningTime);
      }

      // Déconnexion automatique à l'expiration
      timeoutRef.current = setTimeout(() => {
        toast.error('Votre session a expiré. Vous allez être déconnecté automatiquement.');
        setTimeout(() => {
          signOut({ callbackUrl: '/fr/auth' });
        }, 2000);
      }, timeRemaining);

      // Vérifier périodiquement si la session a expiré (toutes les minutes)
      const checkInterval = setInterval(() => {
        const currentTime = Date.now();
        const sessionExpiry = sessionStart + sessionDuration;
        
        if (currentTime >= sessionExpiry) {
          clearInterval(checkInterval);
          toast.error('Votre session a expiré. Vous allez être déconnecté automatiquement.');
          setTimeout(() => {
            signOut({ callbackUrl: '/fr/auth' });
          }, 2000);
        }
      }, 60000); // Vérifier toutes les minutes

      // Nettoyer l'intervalle quand le composant se démonte
      return () => {
        clearInterval(checkInterval);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      };
    }
  }, [session, status]);

  // Gérer les erreurs de session
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      toast.error('Votre session a expiré. Vous allez être déconnecté automatiquement.');
      setTimeout(() => {
        signOut({ callbackUrl: '/fr/auth' });
      }, 2000);
    }
  }, [session]);

  // Nettoyer les timeouts quand l'utilisateur se déconnecte
  useEffect(() => {
    if (status === 'unauthenticated') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    }
  }, [status]);

  return null; // Ce composant ne rend rien visuellement
} 