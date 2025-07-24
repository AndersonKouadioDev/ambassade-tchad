'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
// import VisaForm from '@/components/espace-client/VisaForm';
import VisaForm from '@/components/espace-client/form_news_request/VisaForm';
import ConsulaireCardForm from '@/components/espace-client/form_news_request/ConsulaireCardForm';
// import LaissezPasserForm from '@/components/espace-client/form_news_request/LaissezPasserForm';
import ComingSoonForm from '@/components/espace-client/ComingSoonForm';
import BirthActForm from '@/components/espace-client/form_news_request/BirthActForm';
import CertificatNationaliteForm from '@/components/espace-client/form_news_request/CertificatNationaliteForm';
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react';
import ProcurationForm from '@/components/espace-client/form_news_request/ProcurationForm';
import DeathActForm from '@/components/espace-client/form_news_request/DeathActForm';
import MarriageCapacityActForm from '@/components/espace-client/form_news_request/MarriageCapacityActForm';

// Configuration des types de demandes
const requestTypes = {
  visa: {
    title: 'Demande de Visa',
    description: 'Remplissez ce formulaire pour soumettre votre demande de visa. Assurez-vous d\'avoir tous les documents nécessaires avant de commencer.',
    component: VisaForm,
    documents: [
      'Passeport valide (minimum 6 mois de validité)',
      'Photo d\'identité récente',
      'Justificatif de ressources financières',
      'Réservation d\'hôtel ou invitation',
      'Billet d\'avion aller-retour',
      'Assurance voyage',
      'Justificatif de profession',
      'Casier judiciaire (si applicable)'
    ],
    processingTime: '5-15 jours ouvrables'
  },
  'birth-act': {
    title: "Demande d'Acte de Naissance",
    description: "Remplissez ce formulaire pour demander un acte de naissance.",
    component: BirthActForm,
    documents: [],
    processingTime: '3-7 jours'
  },
  'consular-card': {
    title: 'Demande de Carte Consulaire',
    description: 'Remplissez ce formulaire pour demander une carte consulaire.',
    component: ConsulaireCardForm,
    documents: [],
    processingTime: '10-20 jours'
  },
  // 'laissez-passer': {
  //   title: 'Demande de Laissez-passer',
  //   description: 'Remplissez ce formulaire pour demander un laissez-passer.',
  //   component: LaissezPasserForm,
  //   documents: [],
  //   processingTime: '2-5 jours'
  // },
  'marriage-capacity': {
    title: 'Certificat de Capacité Matrimoniale',
    description: 'Demande de certificat de capacité matrimoniale - Formulaire en cours de développement.',
    component: MarriageCapacityActForm,
    documents: [],
    processingTime: '5-10 jours'
  },
  'death-act': {
    title: 'Demande d\'Acte de Décès',
    description: 'Demande d\'acte de décès - Formulaire en cours de développement.',
    component: DeathActForm,
    documents: [],
    processingTime: '3-7 jours'
  },
  'power-of-attorney': {
    title: 'Demande de Procuration',
    description: 'Remplissez ce formulaire pour demander une procuration.',
    component: ProcurationForm,
    documents: [],
    processingTime: '3-5 jours'
  },
  'nationality-certificate': {
    title: 'Certificat de Nationalité',
    description: 'Demande de certificat de nationalité tchadienne - Formulaire en cours de développement.',
    component: CertificatNationaliteForm,
    documents: [],
    processingTime: '7-15 jours'
  }
};

export default function NouvelleDemandeType() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [showSuccess, setShowSuccess] = useState(false);

  const requestType = params.type as string;
  const requestConfig = requestTypes[requestType as keyof typeof requestTypes];

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push(`/auth?callbackUrl=/espace-client/nouvelle-demande/${requestType}`);
    return null;
  }

  if (!requestConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Type de demande non trouvé
            </h2>
            <p className="text-gray-600 mb-6">
              Le type de demande "{requestType}" n'existe pas.
            </p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => router.push('/espace-client/nouvelle-demande')}
            >
              Retour à la sélection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      router.push('/espace-client/mes-demandes');
    }, 3000);
  };

  const handleError = (error: string) => {
    console.error('Erreur lors de la création de la demande:', error);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Demande créée avec succès !
            </h2>
            <p className="text-gray-600 mb-6">
              Votre demande a été soumise. Vous recevrez bientôt un email de confirmation.
            </p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => router.push('/espace-client/mes-demandes')}
            >
              Voir mes demandes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si le formulaire n'est pas encore développé
  // if (requestConfig.component) {
  //   const FormComponent = requestConfig.component;
  //   return <FormComponent />;
  // }

  // Pour l'instant, tous les formulaires affichent le message "Coming Soon"
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {requestConfig.title}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {requestConfig.description}
            </p>
          </div>
        </div>

        {/* Instructions */}
        {requestConfig.documents.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Documents requis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <ul className="space-y-2">
                {requestConfig.documents.slice(0, Math.ceil(requestConfig.documents.length / 2)).map((doc, index) => (
                  <li key={index}>• {doc}</li>
                ))}
              </ul>
              <ul className="space-y-2">
                {requestConfig.documents.slice(Math.ceil(requestConfig.documents.length / 2)).map((doc, index) => (
                  <li key={index}>• {doc}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Durée de traitement :</strong> {requestConfig.processingTime}
              </p>
            </div>
          </div>
        )}

        {/* Affichage dynamique du formulaire ou fallback */}
        {requestType === 'visa' ? (
          <VisaForm
            request={{}}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        ) : requestConfig.component ? (
          <requestConfig.component />
        ) : (
          <ComingSoonForm
            title={requestConfig.title}
            description={requestConfig.description}
            processingTime={requestConfig.processingTime}
          />
        )}
      </div>
    </div>
  );
}