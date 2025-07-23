'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { birthActRequestDetailsSchema } from '@/lib/validation/details-request.validation';
import { BirthActRequestType } from '@/types/request.types';
import { ServiceType } from '@/types/request.types';
import { Service } from '@/lib/types';
import { birthActApi } from '@/lib/api-client';
import type { z } from 'zod';
type BirthActFormInput = z.infer<typeof birthActRequestDetailsSchema>;

const genderOptions = [
  { value: 'MALE', label: 'Masculin' },
  { value: 'FEMALE', label: 'Féminin' },
];

export default function BirthActForm() {
  const { data: session } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(5);
  const totalSteps = 4;
  const [prixActe, setPrixActe] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'}/demandes/services`);
        const data = await res.json();
        console.log('Réponse API services:', data);
        const arr = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
        arr.forEach((s: any) => console.log('Type service:', s.type));
        const service = arr.find((s: any) => (s.type + '').trim().toUpperCase() === 'BIRTH_ACT_APPLICATION');
        console.log('Service trouvé (string, insensitive):', service);
        setPrixActe(service ? service.defaultPrice : null);
      } catch (e) {
        console.error('Erreur fetch prix:', e);
        setPrixActe(null);
      }
    }
    fetchPrice();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm<BirthActFormInput>({
    resolver: zodResolver(birthActRequestDetailsSchema),
    mode: 'onBlur',
    defaultValues: {
      personFirstName: '',
      personLastName: '',
      personBirthDate: '',
      personBirthPlace: '',
      personNationality: '',
      personDomicile: '',
      fatherFullName: '',
      motherFullName: '',
      requestType: BirthActRequestType.NEWBORN,
      contactPhoneNumber: '',
    },
  });

  // Fixe la valeur par défaut du type de demande à 'EXTRAIT' si non défini
  useEffect(() => {
    if (!watch('requestType')) {
      setValue('requestType', BirthActRequestType.NEWBORN);
    }
  }, [setValue, watch]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFieldsForStep = (step: number): (keyof BirthActFormInput)[] => {
    switch (step) {
      case 1:
        return ['personFirstName', 'personLastName', 'personBirthDate', 'personBirthPlace', 'personNationality', 'personDomicile'];
      case 2:
        return ['fatherFullName', 'motherFullName'];
      case 3:
        return ['requestType', 'contactPhoneNumber'];
      default:
        return [];
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValidStep = await trigger(fieldsToValidate as Parameters<typeof trigger>[0]);
    if (isValidStep && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: BirthActFormInput) => {
    setIsSubmitting(true);
    // Conversion explicite de la date au format ISO-8601
    if (data.personBirthDate && typeof data.personBirthDate === 'string' && !data.personBirthDate.includes('T')) {
      data.personBirthDate = new Date(data.personBirthDate).toISOString();
    }
    // Retirer contactPhoneNumber de birthActDetails
    const { contactPhoneNumber, ...birthActDetails } = data;
    try {
      const result = await birthActApi.create(
        birthActDetails, // sans contactPhoneNumber
        contactPhoneNumber, // à la racine
        uploadedFiles,
        session?.user?.token
      );
      if (result.success) {
        setShowSuccess(true);
        setSuccessCountdown(5);
        const timer = setInterval(() => {
          setSuccessCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              router.push(`/${locale}/espace-client/mes-demandes?success=true`);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        alert(result.error || 'Erreur lors de la création de la demande');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Affichage des erreurs stylé
  const renderError = (error?: { message?: string }) =>
    error?.message ? (
      <div className="flex items-center mt-1 text-red-600 text-sm">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
        </svg>
        {error.message}
      </div>
    ) : null;

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom <span className="text-red-500">*</span></label>
          <input {...register('personFirstName')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Entrez le prénom" />
          {renderError(errors.personFirstName)}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom <span className="text-red-500">*</span></label>
          <input {...register('personLastName')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Entrez le nom" />
          {renderError(errors.personLastName)}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance <span className="text-red-500">*</span></label>
          <input type="date" {...register('personBirthDate')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Date de naissance" />
          {renderError(errors.personBirthDate)}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance <span className="text-red-500">*</span></label>
          <input {...register('personBirthPlace')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Ville, pays de naissance" />
          {renderError(errors.personBirthPlace)}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité <span className="text-red-500">*</span></label>
          <input {...register('personNationality')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Nationalité" />
          {renderError(errors.personNationality)}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Domicile (optionnel)</label>
          <input {...register('personDomicile')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Domicile (optionnel)" />
          {renderError(errors.personDomicile)}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations parentales</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet du père <span className="text-red-500">*</span></label>
          <input {...register('fatherFullName')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Nom complet du père" />
          {renderError(errors.fatherFullName)}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet de la mère <span className="text-red-500">*</span></label>
          <input {...register('motherFullName')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Nom complet de la mère" />
          {renderError(errors.motherFullName)}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const requestTypeLabels: Record<string, string> = {
      NEWBORN: 'Nouveau-né',
      RENEWAL: 'Renouvellement',
    };
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Type de demande</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de demande <span className="text-red-500">*</span></label>
            <select
              {...register('requestType')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              defaultValue=""
            >
              <option value="">Sélectionnez le type de demande</option>
              {Object.values(BirthActRequestType).map((type) => (
                <option key={type} value={type}>{requestTypeLabels[type] || type}</option>
              ))}
            </select>
            {renderError(errors.requestType)}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone <span className="text-red-500">*</span></label>
            <input {...register('contactPhoneNumber')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Numéro de téléphone" />
            {renderError(errors.contactPhoneNumber)}
          </div>
        </div>
        {/* Affichage dynamique du prix */}
        <div className="flex items-center justify-end mt-4">
          <span className="text-lg font-semibold text-green-700">
            Prix à payer : {prixActe !== null ? prixActe.toLocaleString() + ' FCFA' : '...'}
          </span>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents et récapitulatif</h3>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Documents à joindre (PDF, JPG, PNG)</label>
        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Fichiers sélectionnés :</p>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">{file.name}</span>
                <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 ml-2">Supprimer</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-8 bg-white rounded-xl shadow-md">
        <div className="mb-4">
          <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Demande envoyée avec succès !</h2>
        <p className="text-gray-700 mb-4">Vous allez être redirigé vers vos demandes dans {successCountdown} seconde{successCountdown > 1 ? 's' : ''}...</p>
        <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
          <div className="h-2 bg-green-500 transition-all duration-1000" style={{ width: `${(successCountdown/5)*100}%` }}></div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Demande d'Acte de Naissance</h1>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Étape {currentStep} sur {totalSteps}
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {/* Affichage global des erreurs */}
        {Object.keys(errors).length > 0 && (
          <pre style={{ color: 'red' }}>{JSON.stringify(errors, null, 2)}</pre>
        )}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Précédent
            </button>
          )}
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Suivant
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </span>
              ) : 'Soumettre la demande'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 