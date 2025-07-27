'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function SessionTimer() {
  const { data: session } = useSession();
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!session?.user?.iat) return;

    const updateTimer = () => {
      const sessionStart = session.user.iat * 1000;
      const sessionDuration = 8 * 60 * 60 * 1000; // 8 heures
      const currentTime = Date.now();
      const elapsed = currentTime - sessionStart;
      const remaining = sessionDuration - elapsed;

      if (remaining <= 0) {
        setTimeRemaining('Session expirée');
        setIsWarning(true);
        return;
      }

      // Afficher un avertissement si moins de 30 minutes restent
      if (remaining <= 30 * 60 * 1000) {
        setIsWarning(true);
      } else {
        setIsWarning(false);
      }

      // Formater le temps restant
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Mettre à jour toutes les minutes

    return () => clearInterval(interval);
  }, [session]);

  if (!session) return null;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium ${
      isWarning 
        ? 'bg-red-100 text-red-700 border border-red-200' 
        : 'bg-blue-100 text-blue-700 border border-blue-200'
    }`}>
      {isWarning ? (
        <AlertTriangle className="w-3 h-3" />
      ) : (
        <Clock className="w-3 h-3" />
      )}
      <span>
        {isWarning ? 'Session expire dans : ' : 'Session : '}
        {timeRemaining}
      </span>
    </div>
  );
} 