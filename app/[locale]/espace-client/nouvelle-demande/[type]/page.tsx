import { notFound } from 'next/navigation';
import VisaForm from '@/components/espace-client/VisaForm';
import ConsulaireCardForm from '@/components/espace-client/ConsulaireCardForm';
import LaissezPasserForm from '@/components/espace-client/LaissezPasserForm';
import PassportForm from '@/components/espace-client/PassportForm';
import ProcurationForm from '@/components/procuration/procuration';
import CertificatNationaliteForm from '@/components/espace-client/CertificatNationaliteForm'; 
import Image from 'next/image';
import BackButton from '@/components/espace-client/BackButton';
import { getTranslations } from 'next-intl/server';

// Types de demandes supportées
const DEMANDE_TYPES = {
  'visa': {
    name: 'Visa',
    component: VisaForm,
    documents: [
      'Formulaire de demande de visa dûment rempli',
      'Copie de passeport',
      'Passeport en cours de validité (6 mois minimum)',
      'Lettre d\'invitation ou certificat d\'hébergement ou réservation d\'hôtel',
      '2 photos d\'identité'
    ]
  },
  'carte-consulaire': {
    name: 'Carte Consulaire',
    component: ConsulaireCardForm,
    documents: [
      'Acte de Naissance',
      'Copie de passeport',
      '2 photos d\'identité'
    ]
  },
  'laissez-passer': {
    name: 'Laissez-passer',
    component: LaissezPasserForm,
    documents: [
      'Ancien passeport/ Carte Consulaire',
      'Acte de naissance',
      '2 photos d\'identité'
    ]
  },
  'passeport': {
    name: 'Passeport',
    component: PassportForm,
    documents: [
      'Formulaire de demande de visa dûment rempli',
      'Copie de passeport',
      'Passeport en cours de validité (6 mois minimum)',
      'Lettre d\'invitation ou certificat d\'hébergement ou réservation d\'hôtel',
      '2 photos d\'identité'
    ]
  },
  'procuration': {
    name: 'Procuration',
    component: ProcurationForm,
    documents: [
      'Pièce d\'identité du mandant',
      'Pièce d\'identité du mandataire',
      'Justificatif de domicile',
      'Objet de la procuration'
    ]
  },
  'certificat-nationalite': {
    name: 'Certificat de Nationalité',
    component: CertificatNationaliteForm,
    documents: [
      'Acte de naissance',
      'Pièce d\'identité',
      'Justificatif de nationalité',
      '2 photos d\'identité'
    ]
  }
} as const;

export default async function DemandeTypePage({
  params
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params;
  const t = await getTranslations('espaceClient.demande');
  
  // Vérifier si le type de demande existe
  const demandeConfig = DEMANDE_TYPES[type as keyof typeof DEMANDE_TYPES];
  
  if (!demandeConfig) {
    notFound();
  }
  
  const FormComponent = demandeConfig.component;
  
  return (
    <div className="w-full">
      <div className="max-w-8xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <BackButton />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('title', { service: demandeConfig.name })}
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            {t('description', { service: demandeConfig.name.toLowerCase() })}
          </p>
        </div>
        
        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Formulaire - 3/5 de la largeur */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-700 p-6">
              <FormComponent />
            </div>
          </div>
          
          {/* Documents requis - 2/5 de la largeur */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Image 
                  src="/assets/images/logo.png" 
                  alt="Logo Ambassade" 
                  className="w-12 h-12 object-contain"
                  width={100}
                  height={100}
                />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('documentsRequis')}
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {t('documentsAFournir')}
                  </h3>
                  <ul className="space-y-3">
                    {demandeConfig.documents.map((doc, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          {doc}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">i</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {t('informationImportante')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t('documentsValidite')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}