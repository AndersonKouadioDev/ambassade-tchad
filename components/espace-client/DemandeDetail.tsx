"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('espaceClient');
  const params = useParams();
  const { data: session } = useSession();
  const [demande, setDemande] = useState<DemandeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const demandeId = params.demandeId as string;

  useEffect(() => {
    const fetchDemandeDetail = async () => {
      if (!session || !demandeId) {
        setLoading(false);
        setError('Session ou ID de demande manquant');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };

        if (session.user?.token) {
          headers['Authorization'] = `Bearer ${session.user.token}`;
        }

        const res = await fetch(`http://localhost:8081/api/v1/demandes/${demandeId}`, {
          method: 'GET',
          credentials: 'include',
          headers,
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Erreur ${res.status}: ${errorText || 'Erreur lors du chargement de la demande'}`);
        }

        const data = await res.json();
        setDemande(data);
      } catch (e: any) {
        console.error('Fetch error:', e);
        setError(e.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchDemandeDetail();
  }, [session, demandeId]);

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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'NEW': 'bg-blue-100 text-blue-700',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-700',
      'PENDING': 'bg-orange-100 text-orange-700',
      'COMPLETED': 'bg-green-100 text-green-700',
      'READY_TO_PICKUP': 'bg-green-100 text-green-700',
      'REJECTED': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const renderVisaDetails = (details: any) => {
    if (!details) return null;
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Détails du Visa</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <p className="text-gray-900">{details.personFirstName} {details.personLastName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Genre</label>
            <p className="text-gray-900">{details.personGender}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nationalité</label>
            <p className="text-gray-900">{details.personNationality}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
            <p className="text-gray-900">{new Date(details.personBirthDate).toLocaleDateString('fr-FR')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lieu de naissance</label>
            <p className="text-gray-900">{details.personBirthPlace}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profession</label>
            <p className="text-gray-900">{details.profession}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type de visa</label>
            <p className="text-gray-900">{details.visaType}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Durée (mois)</label>
            <p className="text-gray-900">{details.durationMonths}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderConsularCardDetails = (details: any) => {
    if (!details) return null;
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Détails de la Carte Consulaire</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <p className="text-gray-900">{details.personFirstName} {details.personLastName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
            <p className="text-gray-900">{new Date(details.personBirthDate).toLocaleDateString('fr-FR')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lieu de naissance</label>
            <p className="text-gray-900">{details.personBirthPlace}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profession</label>
            <p className="text-gray-900">{details.personProfession}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nationalité</label>
            <p className="text-gray-900">{details.personNationality}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Domicile</label>
            <p className="text-gray-900">{details.personDomicile}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderLaissezPasserDetails = (details: any) => {
    if (!details) return null;
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Détails du Laissez-passer</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <p className="text-gray-900">{details.personFirstName} {details.personLastName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
            <p className="text-gray-900">{new Date(details.personBirthDate).toLocaleDateString('fr-FR')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Destination</label>
            <p className="text-gray-900">{details.destination}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Raison du voyage</label>
            <p className="text-gray-900">{details.travelReason}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Accompagné</label>
            <p className="text-gray-900">{details.accompanied ? 'Oui' : 'Non'}</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des détails de la demande...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!demande) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Demande non trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Demande {demande.ticketNumber}
              </h1>
              <p className="text-gray-600">
                {translateServiceType(demande.serviceType)}
              </p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(demande.status)}`}>
                {translateStatus(demande.status)}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                Montant: {demande.amount.toLocaleString()} FCFA
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date de soumission</label>
              <p className="text-gray-900">{new Date(demande.submissionDate).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dernière mise à jour</label>
              <p className="text-gray-900">{new Date(demande.updatedAt).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <p className="text-gray-900">{demande.contactPhoneNumber}</p>
            </div>
          </div>
        </div>

        {/* Détails spécifiques selon le type de service */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Détails de la demande</h2>
          
          {demande.visaDetails && renderVisaDetails(demande.visaDetails)}
          {demande.consularCardDetails && renderConsularCardDetails(demande.consularCardDetails)}
          {demande.laissezPasserDetails && renderLaissezPasserDetails(demande.laissezPasserDetails)}
          
          {/* Ajouter d'autres types de détails selon les besoins */}
          
          {demande.observations && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Observations</label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{demande.observations}</p>
            </div>
          )}
        </div>

        {/* Bouton retour */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => window.history.back()} 
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            ← Retour aux demandes
          </button>
        </div>
      </div>
    </div>
  );
} 