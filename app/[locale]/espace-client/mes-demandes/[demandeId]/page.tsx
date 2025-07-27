"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ProgressSteps from '@/components/espace-client/ProgressSteps';
import DocumentsSection from '@/components/espace-client/DocumentsSection';
import DemandeDetailsSection from '@/components/espace-client/DemandeDetailsSection';
import DemandeTable from '@/components/espace-client/DemandeTable';
import HistoriqueTraitement from '@/components/espace-client/HistoriqueTraitement';
import { apiClient } from '@/lib/api-client';

interface Document {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

interface DemandeDetail {
  id: string;
  ticketNumber: string;
  userId: string;
  serviceType: string;
  status: string;
  submissionDate: string;
  updatedAt: string;
  completionDate: string | null;
  issuedDate: string | null;
  contactPhoneNumber: string;
  observations: string | null;
  amount: number;
  documents?: Document[];
  visaDetails: any;
  birthActDetails: any;
  consularCardDetails: any;
  laissezPasserDetails: any;
  marriageCapacityActDetails: any;
  deathActDetails: any;
  powerOfAttorneyDetails: any;
  nationalityCertificateDetails: any;
}

export default function DemandeDetail() {
  const params = useParams();
  const { data: session } = useSession();
  const demandeId = params.demandeId as string;
  
  const [demande, setDemande] = useState<DemandeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemandeDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        // Appel API réel avec token et ticket
        const token = session?.user?.token;
        console.log('TOKEN UTILISÉ POUR API:', token);
        const res = await apiClient.getRequestByTicket(demandeId, token);
        if (!res.success || !res.data) throw new Error(res.error || 'Erreur lors du chargement de la demande');
        setDemande(res.data);
      } catch (e: any) {
        setError(e.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (demandeId) {
      fetchDemandeDetail();
    }
  }, [demandeId]);

  // Fonction pour traduire les types de service
  const translateServiceType = (serviceType: string) => {
    const translations: Record<string, string> = {
      'CONSULAR_CARD': 'Carte Consulaire',
      'POWER_OF_ATTORNEY': 'Procuration',
      'MARRIAGE_CAPACITY_ACT': 'Acte de Capacité de Mariage',
      'LAISSEZ_PASSER': 'Laissez-passer',
      'DEATH_ACT_APPLICATION': 'Acte de Décès',
      'NATIONALITY_CERTIFICATE': 'Certificat de Nationalité',
      'BIRTH_ACT_APPLICATION': 'Acte de Naissance',
      'VISA': 'Visa',
    };
    return translations[serviceType] || serviceType;
  };

  // Fonction pour traduire les statuts
  const translateStatus = (status: string) => {
    const translations: Record<string, string> = {
      'NEW': 'Nouveau',
      'IN_PROGRESS': 'En cours',
      'PENDING': 'En attente',
      'COMPLETED': 'Terminé',
      'READY_TO_PICKUP': 'Prêt à retirer',
      'REJECTED': 'Rejeté',
    };
    return translations[status] || status;
  };

  // Données formatées pour l'affichage
  const demandeFormatted = demande ? {
    ticket: demande.ticketNumber,
    service: translateServiceType(demande.serviceType),
    dateSoumission: new Date(demande.submissionDate).toLocaleDateString('fr-FR'),
    status: translateStatus(demande.status),
    montant: demande.amount ? `${demande.amount.toLocaleString()} FCFA` : '',
    dateDelivrance: demande.issuedDate ? new Date(demande.issuedDate).toLocaleDateString('fr-FR') : '',
  } : null;

  // Étapes de progression basées sur le statut
  const getSteps = (status: string) => {
    const allSteps = [
      { label: "Nouveau", done: false },
      { label: "En cours", done: false },
      { label: "En attente", done: false },
      { label: "Prêt à retirer", done: false },
      { label: "Terminé", done: false },
    ];

    const statusIndex = {
      'NEW': 0,
      'IN_PROGRESS': 1,
      'PENDING': 2,
      'READY_TO_PICKUP': 3,
      'COMPLETED': 4,
    };

    const currentIndex = statusIndex[status as keyof typeof statusIndex] || 0;
    
    return allSteps.map((step, index) => ({
      ...step,
      done: index <= currentIndex,
      date: index === currentIndex ? new Date(demande?.updatedAt || '').toLocaleDateString('fr-FR') : '-'
    }));
  };

  const steps = demande ? getSteps(demande.status) : [];
  const progression = demande ? Math.round((steps.filter(s => s.done).length - 1) / (steps.length - 1) * 100) : 0;

  if (loading) {
    return (
      <div className="w-full">
        <div className="mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            Chargement des détails de la demande...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="mx-auto">
          <div className="text-center py-8 text-red-500">
            <div className="text-lg mb-2">⚠️</div>
            {error}
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!demande) {
    return (
      <div className="w-full">
        <div className="mx-auto">
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg mb-2">📋</div>
            Demande non trouvée
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Suivi de la Demande N° {demande.ticketNumber}
        </h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6">
          Retrouvez ici l&apos;historique et le statut de votre demande auprès de l&apos;Ambassade du Tchad.
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-0 md:p-8 mb-8">
          <div className="text-xl font-bold text-gray-900 dark:text-white mb-4 px-4 pt-4">
            Détails de la demande
          </div>
          {demandeFormatted && <DemandeTable demande={demandeFormatted} />}
          <HistoriqueTraitement steps={steps} progression={progression} />
          <div className="w-full flex justify-center">
            <ProgressSteps percent={progression} steps={steps.length} labels={steps.map(s => s.label)} />
          </div>
        </div>
        
        {/* <DocumentsSection /> */}
        <DemandeDetailsSection demande={demande} />
      </div>
    </div>
  );
} 