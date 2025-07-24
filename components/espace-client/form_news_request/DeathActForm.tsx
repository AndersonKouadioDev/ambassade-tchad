import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter, useParams } from 'next/navigation';
import { deathActApi } from '@/lib/api-client';

const deathActSchema = z.object({
  deceasedFirstName: z.string().min(1, 'Le prénom du défunt est requis'),
  deceasedLastName: z.string().min(1, 'Le nom du défunt est requis'),
  deceasedBirthDate: z.string().min(1, 'La date de naissance est requise').refine(val => !isNaN(new Date(val).getTime()), { message: 'Date invalide' }),
  deceasedNationality: z.string().min(1, 'La nationalité est requise'),
  deceasedDeathDate: z.string().min(1, 'La date de décès est requise').refine(val => !isNaN(new Date(val).getTime()), { message: 'Date invalide' }),
  contactPhoneNumber: z.string().min(1, 'Le numéro de contact est requis').regex(/^\+?[0-9\s\-]+$/, 'Numéro de téléphone invalide'),
  justificativeFile: z.any().refine(file => file instanceof File, 'La pièce justificative est requise'),
});

type DeathActFormInput = z.infer<typeof deathActSchema>;

export default function DeathActForm() {
  const { register, handleSubmit, formState: { errors }, setValue, trigger, watch, reset } = useForm<DeathActFormInput>({
    resolver: zodResolver(deathActSchema),
    mode: 'onBlur',
    defaultValues: {
      deceasedFirstName: '',
      deceasedLastName: '',
      deceasedBirthDate: '',
      deceasedNationality: '',
      deceasedDeathDate: '',
      contactPhoneNumber: '',
      justificativeFile: undefined,
    },
  });

  const totalSteps = 3;
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prixActe, setPrixActe] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(5);
  const router = useRouter();
  const params = useParams();
  const locale = Array.isArray(params?.locale) ? params.locale[0] : params?.locale || 'fr';

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'}/demandes/services`);
        const data = await res.json();
        const service = Array.isArray(data)
          ? (data as any[]).find((s: any) => s.type === 'DEATH_ACT_APPLICATION')
          : Array.isArray(data.data)
            ? (data.data as any[]).find((s: any) => s.type === 'DEATH_ACT_APPLICATION')
            : null;
        setPrixActe(service ? service.defaultPrice : null);
      } catch (e) {
        setPrixActe(null);
      }
    }
    fetchPrice();
  }, []);

  function getFieldsForStep(step: number): (keyof DeathActFormInput)[] {
    switch (step) {
      case 1:
        return ['deceasedFirstName', 'deceasedLastName', 'deceasedBirthDate', 'deceasedNationality'];
      case 2:
        return ['deceasedDeathDate', 'contactPhoneNumber'];
      case 3:
        return ['justificativeFile'];
      default:
        return [];
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValidStep = await trigger(fieldsToValidate as any);
    if (isValidStep && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (!isValidStep) {
      toast.error('Veuillez corriger les erreurs avant de continuer');
    }
  };

  const onSubmit = async (data: DeathActFormInput) => {
    setIsSubmitting(true);
    try {
      const { contactPhoneNumber, justificativeFile, ...details } = data;
      const payload = {
        ...details,
        deceasedBirthDate: new Date(data.deceasedBirthDate).toISOString(),
        deceasedDeathDate: new Date(data.deceasedDeathDate).toISOString(),
      };
      const response = await deathActApi.create(
        payload,
        contactPhoneNumber,
        uploadedFile ? [uploadedFile] : undefined
      );
      if (response.success) {
        setShowSuccess(true);
        let timer = setInterval(() => {
          setSuccessCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              router.push(`/${locale}/espace-client/mes-demandes?success=true`);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        reset();
        setUploadedFile(null);
        setCurrentStep(1);
      } else {
        toast.error(response.error || "Erreur lors de l'envoi de la demande");
      }
    } catch (error) {
      toast.error('Une erreur est survenue lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-xl flex flex-col items-center justify-center mt-16">
        <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="text-2xl font-bold text-green-700 mb-2">Demande envoyée avec succès !</h2>
        <p className="text-gray-700 mb-4">Vous allez être redirigé vers vos demandes dans {successCountdown} seconde{successCountdown > 1 ? 's' : ''}...</p>
        <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-2">
          <div className="h-2 bg-green-500 transition-all duration-1000" style={{ width: `${(successCountdown/5)*100}%` }}></div>
        </div>
      </div>
    );
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations sur le défunt</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom du défunt *</label>
          <input {...register('deceasedFirstName')} placeholder="Ex: Mahamat" className={`w-full px-4 py-2 border rounded-md ${errors.deceasedFirstName ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.deceasedFirstName && <p className="text-red-500 text-xs mt-1">{errors.deceasedFirstName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du défunt *</label>
          <input {...register('deceasedLastName')} placeholder="Ex: Idriss" className={`w-full px-4 py-2 border rounded-md ${errors.deceasedLastName ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.deceasedLastName && <p className="text-red-500 text-xs mt-1">{errors.deceasedLastName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
          <input type="date" {...register('deceasedBirthDate')} className={`w-full px-4 py-2 border rounded-md ${errors.deceasedBirthDate ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.deceasedBirthDate && <p className="text-red-500 text-xs mt-1">{errors.deceasedBirthDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité *</label>
          <input {...register('deceasedNationality')} placeholder="Ex: Tchadienne" className={`w-full px-4 py-2 border rounded-md ${errors.deceasedNationality ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.deceasedNationality && <p className="text-red-500 text-xs mt-1">{errors.deceasedNationality.message}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Décès et contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de décès *</label>
          <input type="date" {...register('deceasedDeathDate')} className={`w-full px-4 py-2 border rounded-md ${errors.deceasedDeathDate ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.deceasedDeathDate && <p className="text-red-500 text-xs mt-1">{errors.deceasedDeathDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de contact *</label>
          <input {...register('contactPhoneNumber')} placeholder="Ex: +225 01 23 45 67 89" className={`w-full px-4 py-2 border rounded-md ${errors.contactPhoneNumber ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.contactPhoneNumber && <p className="text-red-500 text-xs mt-1">{errors.contactPhoneNumber.message}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pièce justificative et prix</h3>
      <div className="mb-4">
        <span className="text-lg font-semibold text-green-700">
          Prix à payer : {prixActe?.toLocaleString() ?? '10,000'} FCFA
        </span>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Pièce justificative *</label>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={e => {
            setUploadedFile(e.target.files?.[0] || null);
            setValue('justificativeFile', e.target.files?.[0] || undefined, { shouldValidate: true });
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {errors.justificativeFile && (
          <p className="text-red-500 text-xs mt-1">
            {typeof errors.justificativeFile === 'object' && errors.justificativeFile !== null && 'message' in errors.justificativeFile
              ? (errors.justificativeFile as { message?: string }).message
              : typeof errors.justificativeFile === 'string'
                ? errors.justificativeFile
                : ''}
          </p>
        )}
        {uploadedFile && <div className="mt-2 text-sm text-gray-700">Fichier sélectionné : {uploadedFile.name}</div>}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Formulaire de demande de Certificat de Décès</h1>
      <div className="mb-6">
        <div className="flex items-center">
          {[...Array(totalSteps)].map((_, i) => (
            <React.Fragment key={i}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep > i + 1
                    ? 'bg-green-500 text-white'
                    : currentStep === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > i + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        <div className="flex justify-between items-center mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Précédent
            </button>
          )}
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Suivant
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
