'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

const serviceTypes = [
  {
    id: 'visa',
    title: 'Visa',
    description: 'Demande de visa pour séjour au Tchad',
    href: '/espace-client/nouvelle-demande/visa',
    features: ['Court séjour', 'Long séjour', 'Transit', 'Affaires', 'Étudiant', 'Travail']
  },
  {
    id: 'birth-act',
    title: 'Acte de naissance',
    description: "Demande d'acte de naissance",
    href: '/espace-client/nouvelle-demande/birth-act',
    features: ['Copie intégrale', 'Extrait avec filiation', 'Extrait sans filiation']
  },
  {
    id: 'consular-card',
    title: 'Carte consulaire',
    description: 'Demande de carte consulaire',
    href: '/espace-client/nouvelle-demande/consular-card',
    features: ["Carte nationale d'identité", 'Justificatif de résidence']
  },
  {
    id: 'laissez-passer',
    title: 'Laissez-passer',
    description: 'Demande de laissez-passer',
    href: '/espace-client/nouvelle-demande/laissez-passer',
    features: ['Urgence', 'Voyage temporaire', 'Retour au pays']
  },
  {
    id: 'marriage-capacity',
    title: 'Certificat de capacité matrimoniale',
    description: 'Demande de certificat de capacité matrimoniale',
    href: '/espace-client/nouvelle-demande/marriage-capacity',
    features: ['Mariage civil', 'Mariage religieux', 'Justificatif de célibat']
  },
  {
    id: 'death-act',
    title: 'Acte de décès',
    description: "Demande d'acte de décès",
    href: '/espace-client/nouvelle-demande/death-act',
    features: ['Copie intégrale', 'Extrait', 'Certificat de décès']
  },
  {
    id: 'power-of-attorney',
    title: 'Procuration',
    description: 'Demande de procuration',
    href: '/espace-client/nouvelle-demande/power-of-attorney',
    features: ['Procuration générale', 'Procuration spéciale', 'Mandat']
  },
  {
    id: 'nationality-certificate',
    title: 'Certificat de nationalité',
    description: 'Demande de certificat de nationalité tchadienne',
    href: '/espace-client/nouvelle-demande/nationality-certificate',
    features: ['Certificat de nationalité', 'Justificatif de citoyenneté']
  }
];

export default function NouvelleDemande() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();

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
    router.push('/auth?callbackUrl=/espace-client/nouvelle-demande');
    return null;
  }

  const handleNavigate = (href: string) => {
    router.push(`/${locale}${href}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nouvelle demande
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sélectionnez le type de service pour lequel vous souhaitez faire une demande.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {serviceTypes.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer p-6"
              onClick={() => handleNavigate(service.href)}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {service.description}
              </p>
              <ul className="mb-4 text-xs text-gray-500">
                {service.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
              <button
                className="w-full px-4 py-2 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700"
                onClick={e => { e.stopPropagation(); handleNavigate(service.href); }}
              >
                Commencer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 