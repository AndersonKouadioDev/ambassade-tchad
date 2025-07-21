'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createVisaRequestWithFormData, getVisaRequests, getVisaRequestById } from '@/src/actions/visa-request.action';
import { VisaRequestDetailsInput } from '@/src/schemas/visa-request.schemas';

export interface UseVisaRequestReturn {
  // États
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  
  // Actions
  createVisaRequest: (data: VisaRequestDetailsInput, contactPhoneNumber?: string, documents?: File[]) => Promise<void>;
  fetchVisaRequests: (filters?: { status?: string; page?: number; limit?: number }) => Promise<void>;
  fetchVisaRequest: (requestId: string) => Promise<void>;
  
  // Données
  requests: any[];
  currentRequest: any | null;
  
  // Utilitaires
  clearError: () => void;
  clearSuccess: () => void;
}

export function useVisaRequest(): UseVisaRequestReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [currentRequest, setCurrentRequest] = useState<any | null>(null);
  
  const router = useRouter();

  const createVisaRequest = useCallback(async (
    data: VisaRequestDetailsInput,
    contactPhoneNumber?: string,
    documents?: File[]
  ) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await createVisaRequestWithFormData(data, contactPhoneNumber, documents);

      if (result.success) {
        setSuccess(true);
        // Redirection après un délai pour permettre à l'utilisateur de voir le message de succès
        setTimeout(() => {
          router.push('/espace-client/mes-demandes?success=true');
        }, 2000);
      } else {
        setError(result.error || 'Erreur lors de la création de la demande');
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
      console.error('Erreur lors de la création de la demande:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [router]);

  const fetchVisaRequests = useCallback(async (filters?: { status?: string; page?: number; limit?: number }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getVisaRequests(filters);

      if (result.success) {
        setRequests(result.data || []);
      } else {
        setError(result.error || 'Erreur lors de la récupération des demandes');
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
      console.error('Erreur lors de la récupération des demandes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchVisaRequest = useCallback(async (requestId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getVisaRequestById(requestId);

      if (result.success) {
        setCurrentRequest(result.data);
      } else {
        setError(result.error || 'Erreur lors de la récupération de la demande');
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
      console.error('Erreur lors de la récupération de la demande:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccess(false);
  }, []);

  return {
    // États
    isLoading,
    isSubmitting,
    error,
    success,
    
    // Actions
    createVisaRequest,
    fetchVisaRequests,
    fetchVisaRequest,
    
    // Données
    requests,
    currentRequest,
    
    // Utilitaires
    clearError,
    clearSuccess,
  };
}

// Hook pour gérer les formulaires de visa
export function useVisaForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<VisaRequestDetailsInput>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const { createVisaRequest, isSubmitting, error, success } = useVisaRequest();

  const updateFormData = useCallback((field: keyof VisaRequestDetailsInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const addFile = useCallback((file: File) => {
    setUploadedFiles(prev => [...prev, file]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const submitForm = useCallback(async (contactPhoneNumber?: string) => {
    if (Object.keys(formData).length === 0) {
      return;
    }

    await createVisaRequest(formData as VisaRequestDetailsInput, contactPhoneNumber, uploadedFiles);
  }, [formData, uploadedFiles, createVisaRequest]);

  return {
    // États du formulaire
    currentStep,
    formData,
    uploadedFiles,
    
    // Actions du formulaire
    updateFormData,
    addFile,
    removeFile,
    nextStep,
    prevStep,
    submitForm,
    
    // États de soumission
    isSubmitting,
    error,
    success,
  };
} 