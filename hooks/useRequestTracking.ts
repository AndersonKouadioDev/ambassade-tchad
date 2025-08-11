"use client";

import { useState, useCallback } from 'react';
import { trackDemandByTicketAction } from '@/features/demande/actions/demande.action';
import { IDemande } from '@/features/demande/types/demande.type';

interface UseRequestTrackingReturn {
  request: IDemande | null;
  isLoading: boolean;
  error: string | null;
  trackRequest: (ticketNumber: string) => Promise<void>;
  clearRequest: () => void;
  refreshRequest: () => Promise<void>;
}

export function useRequestTracking(initialRequest?: IDemande): UseRequestTrackingReturn {
  const [request, setRequest] = useState<IDemande | null>(initialRequest || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTicketNumber, setLastTicketNumber] = useState<string>('');

  const trackRequest = useCallback(async (ticketNumber: string) => {
    if (!ticketNumber.trim()) {
      setError('Veuillez saisir un numéro de ticket');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLastTicketNumber(ticketNumber);

    try {
      const response = await trackDemandByTicketAction(ticketNumber);
      
      if (response.success && response.data) {
        setRequest(response.data);
      } else {
        setError(response.error || 'Demande non trouvée. Vérifiez le numéro de ticket.');
        setRequest(null);
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
      setRequest(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshRequest = useCallback(async () => {
    if (lastTicketNumber) {
      await trackRequest(lastTicketNumber);
    }
  }, [lastTicketNumber, trackRequest]);

  const clearRequest = useCallback(() => {
    setRequest(null);
    setError(null);
    setLastTicketNumber('');
  }, []);

  return {
    request,
    isLoading,
    error,
    trackRequest,
    clearRequest,
    refreshRequest
  };
}
