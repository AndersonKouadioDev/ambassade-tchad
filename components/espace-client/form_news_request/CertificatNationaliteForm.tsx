import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { OriginCountryParentRelationshipType, Service } from '@/types/request.types';
import { toast } from 'react-toastify';
import { nationalityCertificateApi } from '@/lib/api-client';
import { useRouter, useParams } from 'next/navigation';

// Schéma de validation
const nationalityCertificateSchema = z.object({
  applicantFirstName: z.string().min(1, 'Le prénom est requis'),
  applicantLastName: z.string().min(1, 'Le nom est requis'),
  applicantBirthDate: z.string().min(1, 'La date de naissance est requise').refine(val => !isNaN(new Date(val).getTime()), { message: 'Date invalide' }),
  applicantBirthPlace: z.string().min(1, 'Le lieu de naissance est requis'),
  applicantNationality: z.string().min(1, 'La nationalité est requise'),
  originCountryParentFirstName: z.string().min(1, 'Le prénom du parent est requis'),
  originCountryParentLastName: z.string().min(1, 'Le nom du parent est requis'),
  originCountryParentRelationship: z.nativeEnum(OriginCountryParentRelationshipType)
    .refine(val => val === OriginCountryParentRelationshipType.FATHER || val === OriginCountryParentRelationshipType.MOTHER, {
      message: 'Le lien de parenté est requis',
    }),
  contactPhoneNumber: z.string().min(1, 'Le numéro de contact est requis').regex(/^\+?[0-9\s\-]+$/, 'Numéro de téléphone invalide'),
  justificativeFile: z.any().optional(),
});

type NationalityCertificateFormInput = z.infer<typeof nationalityCertificateSchema>;

export default function CertificatNationaliteForm() {
  const { register, handleSubmit, formState: { errors }, trigger, reset, setValue } = useForm<NationalityCertificateFormInput>({
    resolver: zodResolver(nationalityCertificateSchema),
    mode: 'onBlur',
    defaultValues: {
      applicantFirstName: '',
      applicantLastName: '',
      applicantBirthDate: '',
      applicantBirthPlace: '',
      applicantNationality: '',
      originCountryParentFirstName: '',
      originCountryParentLastName: '',
      originCountryParentRelationship: undefined,
      contactPhoneNumber: '',
      justificativeFile: undefined,
    },
  });

  const totalSteps = 3;
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prixActe, setPrixActe] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(5);
  const router = useRouter();
  const params = useParams();
  const locale = Array.isArray(params?.locale) ? params.locale[0] : params?.locale || 'fr';
  const error = null;
  // Récupération du prix dynamique
  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'}/demandes/services`);
        const data = await res.json();
        const service = Array.isArray(data)
          ? (data as Service[]).find((s: Service) => s.type === 'NATIONALITY_CERTIFICATE')
          : Array.isArray(data.data)
            ? (data.data as Service[]).find((s: Service) => s.type === 'NATIONALITY_CERTIFICATE')
            : null;
        setPrixActe(service ? service.defaultPrice : null);
      } catch (error) {
        setPrixActe(null);
      }
    }
    fetchPrice();
  }, []);

  // Gestion des champs par étape
  function getFieldsForStep(step: number): (keyof NationalityCertificateFormInput)[] {
    switch (step) {
      case 1:
        return ['applicantFirstName', 'applicantLastName', 'applicantBirthDate', 'applicantBirthPlace', 'applicantNationality'];
      case 2:
        return ['originCountryParentFirstName', 'originCountryParentLastName', 'originCountryParentRelationship'];
      case 3:
        return ['contactPhoneNumber', 'justificativeFile'];
      default:
        return [];
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValidStep = await trigger(fieldsToValidate as Parameters<typeof trigger>[0]);
    if (isValidStep && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (!isValidStep) {
      toast.error('Veuillez corriger les erreurs avant de continuer');
    }
  };

  const onSubmit = async (data: NationalityCertificateFormInput) => {
    console.log('submit', data);
    setIsSubmitting(true);
    try {
      // Prépare le payload
      const { contactPhoneNumber, ...details } = data;
      const payload = {
        ...details,
        applicantBirthDate: new Date(data.applicantBirthDate).toISOString(),
      };
      const response = await nationalityCertificateApi.create(
        payload,
        contactPhoneNumber,
        uploadedFiles
      );
      if (response.success) {
        setShowSuccess(true);
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
        reset();
        setUploadedFiles([]);
        setCurrentStep(1);
      } else {
        toast.error(response.error || "Erreur lors de l'envoi de la demande");
      }
    } catch {
      toast.error('Une erreur est survenue lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rendu des étapes
  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
          <input {...register('applicantFirstName')} placeholder="Ex: Mahamat" className={`w-full px-4 py-2 border rounded-md ${errors.applicantFirstName ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.applicantFirstName && <p className="text-red-500 text-xs mt-1">{errors.applicantFirstName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
          <input {...register('applicantLastName')} placeholder="Ex: Idriss" className={`w-full px-4 py-2 border rounded-md ${errors.applicantLastName ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.applicantLastName && <p className="text-red-500 text-xs mt-1">{errors.applicantLastName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
          <input type="date" {...register('applicantBirthDate')} placeholder="Date de naissance" className={`w-full px-4 py-2 border rounded-md ${errors.applicantBirthDate ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.applicantBirthDate && <p className="text-red-500 text-xs mt-1">{errors.applicantBirthDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance *</label>
          <input {...register('applicantBirthPlace')} placeholder="Ex: N'Djamena" className={`w-full px-4 py-2 border rounded-md ${errors.applicantBirthPlace ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.applicantBirthPlace && <p className="text-red-500 text-xs mt-1">{errors.applicantBirthPlace.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité *</label>
          <input {...register('applicantNationality')} placeholder="Ex: Tchadienne" className={`w-full px-4 py-2 border rounded-md ${errors.applicantNationality ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.applicantNationality && <p className="text-red-500 text-xs mt-1">{errors.applicantNationality.message}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations sur le parent d&apos;origine et contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom du parent *</label>
          <input {...register('originCountryParentFirstName')} placeholder="Ex: Youssouf" className={`w-full px-4 py-2 border rounded-md ${errors.originCountryParentFirstName ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.originCountryParentFirstName && <p className="text-red-500 text-xs mt-1">{errors.originCountryParentFirstName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du parent *</label>
          <input {...register('originCountryParentLastName')} placeholder="Ex: Abakar" className={`w-full px-4 py-2 border rounded-md ${errors.originCountryParentLastName ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.originCountryParentLastName && <p className="text-red-500 text-xs mt-1">{errors.originCountryParentLastName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lien de parenté *</label>
          <select {...register('originCountryParentRelationship')} className={`w-full px-4 py-2 border rounded-md ${errors.originCountryParentRelationship ? 'border-red-500' : 'border-gray-300'}`} defaultValue="">
            <option value="">Sélectionnez</option>
            <option value={OriginCountryParentRelationshipType.FATHER}>Père</option>
            <option value={OriginCountryParentRelationshipType.MOTHER}>Mère</option>
          </select>
          {errors.originCountryParentRelationship && <p className="text-red-500 text-xs mt-1">{errors.originCountryParentRelationship.message}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif et pièce justificative</h3>
      <div className="mb-4">
        <span className="text-lg font-semibold text-green-700">
          Prix à payer : {prixActe?.toLocaleString() ?? '10,000'} FCFA
        </span>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Pièces justificatives *</label>
        <div
          className={
            `w-full border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ` +
            `hover:border-blue-400 bg-gray-50`
          }
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={e => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              setUploadedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/*"
            multiple
            className="hidden"
            onChange={e => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              if (files.length > 0) {
                setUploadedFiles(prev => {
                  const newFiles = [...prev, ...files];
                  setValue('justificativeFile', newFiles, { shouldValidate: true });
                  return newFiles;
                });
              }
            }}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-blue-700 font-semibold">Glissez-déposez vos fichiers ici ou cliquez pour sélectionner</span>
            <span className="text-xs text-gray-500">Formats acceptés : PDF, images. Plusieurs fichiers possibles.</span>
            <span className="text-xs text-gray-500">{uploadedFiles.length} fichier{uploadedFiles.length > 1 ? 's' : ''} sélectionné{uploadedFiles.length > 1 ? 's' : ''}</span>
          </div>
        </div>
        {uploadedFiles.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-4">
            {uploadedFiles.map((file, idx) => (
              <li key={idx} className="relative flex flex-col items-center w-24">
                {file.type.startsWith('image/') ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded shadow border"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded shadow border">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                )}
                <span className="text-xs mt-1 truncate w-full text-center" title={file.name}>{file.name}</span>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setUploadedFiles(prev => {
                      const newFiles = prev.filter((_, i) => i !== idx);
                      setValue('justificativeFile', newFiles.length > 0 ? newFiles : undefined, { shouldValidate: true });
                      return newFiles;
                    });
                  }}
                  className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-100"
                  title="Supprimer"
                >✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Champ numéro de contact déplacé ici */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de contact *</label>
        <input {...register('contactPhoneNumber')} placeholder="Ex: +225 01 23 45 67 89" className={`w-full px-4 py-2 border rounded-md ${errors.contactPhoneNumber ? 'border-red-500' : 'border-gray-300'}`} />
        {errors.contactPhoneNumber && <p className="text-red-500 text-xs mt-1">{errors.contactPhoneNumber.message}</p>}
      </div>
    </div>
  );

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-xl flex flex-col items-center justify-center mt-16">
        <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="text-2xl font-bold text-green-700 mb-2">Demande envoyée avec succès&nbsp;!</h2>
        <p className="text-gray-700 mb-4">Vous allez être redirigé vers vos demandes dans {successCountdown} seconde{successCountdown > 1 ? '&nbsp;s' : ''}...</p>
        <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-2">
          <div className="h-2 bg-green-500 transition-all duration-1000" style={{ width: `${(successCountdown/5)*100}%` }}></div>
        </div>
      </div>
    );
  }

  // Log des erreurs de validation RHF
  console.log('form errors', errors);
  // Affichage global des erreurs de validation
  {Object.keys(errors).length > 0 && (
    <div className="text-red-600 text-sm mb-4">Veuillez corriger les erreurs dans le formulaire avant de soumettre.</div>
  )}

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Formulaire de demande de Certificat de Nationalité</h1>
      {/* Barre de progression */}
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
                    currentStep > i + 1 ? 'bg-orange-500' : 'bg-gray-200'
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
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
