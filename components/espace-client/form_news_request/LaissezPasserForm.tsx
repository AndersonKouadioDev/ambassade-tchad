import { FieldError, useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { JustificationDocumentType } from '@/types/request.types';
import React, { useEffect, useState, useRef } from "react";
import { laissezPasserApi } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useLocale } from 'next-intl';

// Schéma de validation
export const laissezPasserRequestDetailsSchema = z.object({
  personFirstName: z.string().min(1, "Le prénom est requis"),
  personLastName: z.string().min(1, "Le nom est requis"),
  personBirthDate: z.string().min(1, "La date de naissance est requise")
    .refine(val => !isNaN(new Date(val).getTime()), { message: "Date invalide" }),
  personBirthPlace: z.string().min(1, "Le lieu de naissance est requis"),
  personProfession: z.string().optional(),
  personNationality: z.string().min(1, "La nationalité est requise"),
  personDomicile: z.string().optional(),
  fatherFullName: z.string().optional(),
  motherFullName: z.string().optional(),
  destination: z.string().min(1, "La destination est requise"),
  travelReason: z.string().min(1, "Le motif du voyage est requis"),
  accompanied: z.boolean().default(false),
  justificationDocumentType: z.nativeEnum(JustificationDocumentType).optional(),
  justificationDocumentNumber: z.string().optional(),
  laissezPasserExpirationDate: z.string().min(1, "La date d'expiration est requise")
    .refine(val => !isNaN(new Date(val).getTime()), { message: "Date invalide" }),
  contactPhoneNumber: z.string().min(1, "Le numéro de contact est requis")
    .regex(/^\+?[0-9\s\-]+$/, "Numéro de téléphone invalide"),
  accompaniers: z.array(z.object({
    firstName: z.string().min(1, "Le prénom est requis"),
    lastName: z.string().min(1, "Le nom est requis"),
    birthDate: z.string().min(1, "La date de naissance est requise")
      .refine(val => !isNaN(new Date(val).getTime()), { message: "Date invalide" }),
    birthPlace: z.string().min(1, "Le lieu de naissance est requis"),
    nationality: z.string().min(1, "La nationalité est requise"),
    domicile: z.string().optional(),
  })).optional(),
});

type LaissezPasserFormInput = z.infer<typeof laissezPasserRequestDetailsSchema>;

export default function LaissezPasserForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue, 
    trigger, 
    watch,
    reset,
    control,
    clearErrors
  } = useForm<LaissezPasserFormInput>({
    resolver: zodResolver(laissezPasserRequestDetailsSchema) as any,
    mode: 'onBlur',
    defaultValues: {
      personFirstName: '',
      personLastName: '',
      personBirthDate: '',
      personBirthPlace: '',
      personProfession: '',
      personNationality: '',
      personDomicile: '',
      fatherFullName: '',
      motherFullName: '',
      destination: '',
      travelReason: '',
      accompanied: false,
      justificationDocumentType: undefined,
      justificationDocumentNumber: '',
      laissezPasserExpirationDate: '',
      contactPhoneNumber: '',
      accompaniers: [],
    },
  });

  const totalSteps = 4;
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [prixActe, setPrixActe] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(5);
  const router = useRouter();
  const locale = useLocale();
  const accompaniedValue = watch('accompanied');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Ajout du log de debug
  console.log('currentStep', currentStep, 'accompaniedValue', accompaniedValue);

  // Ajoute la fonction renderStep1 pour l'étape 1
  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
          <input
            {...register('personFirstName')}
            placeholder="Ex: Mahamat"
            className={`w-full px-4 py-2 border rounded-md ${errors.personFirstName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.personFirstName && (
            <p className="text-red-500 text-xs mt-1">{errors.personFirstName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
          <input
            {...register('personLastName')}
            placeholder="Ex: Idriss"
            className={`w-full px-4 py-2 border rounded-md ${errors.personLastName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.personLastName && (
            <p className="text-red-500 text-xs mt-1">{errors.personLastName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
          <input
            type="date"
            {...register('personBirthDate')}
            className={`w-full px-4 py-2 border rounded-md ${errors.personBirthDate ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.personBirthDate && (
            <p className="text-red-500 text-xs mt-1">{errors.personBirthDate.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance *</label>
          <input
            {...register('personBirthPlace')}
            placeholder="Ex: N'Djamena"
            className={`w-full px-4 py-2 border rounded-md ${errors.personBirthPlace ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.personBirthPlace && (
            <p className="text-red-500 text-xs mt-1">{errors.personBirthPlace.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type de pièce justificative</label>
          <select
            {...register('justificationDocumentType')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            defaultValue=""
          >
            <option value="">Sélectionnez</option>
            {Object.values(JustificationDocumentType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
  // Ajoute la fonction renderStep2 pour l'étape 2
  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nationalité et filiation</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité *</label>
          <input
            {...register('personNationality')}
            placeholder="Ex: Tchadienne"
            className={`w-full px-4 py-2 border rounded-md ${errors.personNationality ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.personNationality && (
            <p className="text-red-500 text-xs mt-1">{errors.personNationality.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Domicile</label>
          <input
            {...register('personDomicile')}
            placeholder="Ex: 12 rue de N'Djamena"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet du père</label>
          <input
            {...register('fatherFullName')}
            placeholder="Ex: Youssouf Mahamat"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet de la mère</label>
          <input
            {...register('motherFullName')}
            placeholder="Ex: Fatimé Abakar"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de pièce justificative</label>
          <input
            {...register('justificationDocumentNumber')}
            placeholder="Ex: CNI123456"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone *</label>
          <input
            {...register('contactPhoneNumber')}
            placeholder="Ex: +225 01 23 45 67 89"
            className={`w-full px-4 py-2 border rounded-md ${errors.contactPhoneNumber ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.contactPhoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.contactPhoneNumber.message}</p>
          )}
        </div>
      </div>
    </div>
  );
  // Ajoute la fonction renderStep3 pour l'étape 3
  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations sur le voyage</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
          <input
            {...register('destination')}
            placeholder="Ex: Paris, France"
            className={`w-full px-4 py-2 border rounded-md ${errors.destination ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.destination && (
            <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motif du voyage *</label>
          <input
            {...register('travelReason')}
            placeholder="Ex: Visite familiale, affaires..."
            className={`w-full px-4 py-2 border rounded-md ${errors.travelReason ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.travelReason && (
            <p className="text-red-500 text-xs mt-1">{errors.travelReason.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Accompagné ? *</label>
          <select
            {...register('accompanied', { setValueAs: v => v === 'true' })}
            className={`w-full px-4 py-2 border rounded-md ${errors.accompanied ? 'border-red-500' : 'border-gray-300'}`}
            defaultValue="false"
          >
            <option value="false">Non</option>
            <option value="true">Oui</option>
          </select>
          {errors.accompanied && (
            <p className="text-red-500 text-xs mt-1">{errors.accompanied.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration du laissez-passer *</label>
          <input
            type="date"
            {...register('laissezPasserExpirationDate')}
            className={`w-full px-4 py-2 border rounded-md ${errors.laissezPasserExpirationDate ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.laissezPasserExpirationDate && (
            <p className="text-red-500 text-xs mt-1">{errors.laissezPasserExpirationDate.message}</p>
          )}
        </div>
      </div>
    </div>
  );
  // Ajoute la fonction renderNavigation pour les boutons
  const renderNavigation = () => (
    <div className="flex justify-between items-center mt-6">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={prevStep}
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
  );

  // Ajoute la barre de progression
  const renderProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      ></div>
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>Étape {currentStep} / {totalSteps}</span>
        <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
      </div>
    </div>
  );

  // Récupération du prix
  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'}/demandes/services`);
        const data = await res.json();
        const service = Array.isArray(data) 
          ? (data as any[]).find((s: any) => s.type === 'LAISSEZ_PASSER')
          : Array.isArray(data.data) 
            ? (data.data as any[]).find((s: any) => s.type === 'LAISSEZ_PASSER')
            : null;
        setPrixActe(service ? service.defaultPrice : null);
      } catch (e) {
        setPrixActe(null);
      }
    }
    fetchPrice();
  }, []);

  function getFieldsForStep(step: number): (keyof LaissezPasserFormInput)[] {
    switch (step) {
      case 1:
        return ['personFirstName', 'personLastName', 'personBirthDate', 'personBirthPlace', 'justificationDocumentType'];
      case 2:
        return ['personNationality', 'personDomicile', 'fatherFullName', 'motherFullName', 'justificationDocumentNumber', 'contactPhoneNumber'];
      case 3:
        return ['destination', 'travelReason', 'accompanied', 'laissezPasserExpirationDate'];
      case 4:
        return accompaniedValue ? ['accompaniers'] : [];
      default:
        return [];
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValidStep = await trigger(fieldsToValidate as any);
    if (isValidStep) {
      if (currentStep === 3 && !accompaniedValue) {
        setCurrentStep(currentStep + 2); // saute l'étape 4 si pas accompagné
      } else if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error('Veuillez corriger les erreurs avant de continuer');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Dans onSubmit, vérifie la présence d'au moins un fichier justificatif en tableau
  const onSubmit = async (data: LaissezPasserFormInput) => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      toast.error('Au moins un fichier justificatif est obligatoire.');
      return;
    }
    setIsSubmitting(true);
    try {
      const { contactPhoneNumber, accompaniers, ...details } = data;
      const payload = {
        ...details,
        personBirthDate: new Date(data.personBirthDate).toISOString(),
        laissezPasserExpirationDate: new Date(data.laissezPasserExpirationDate).toISOString(),
        accompaniers: accompaniers?.map(acc => ({
          ...acc,
          birthDate: new Date(acc.birthDate).toISOString()
        }))
      };

      const response = await laissezPasserApi.create(
        payload,
        contactPhoneNumber,
        uploadedFiles
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
        setUploadedFiles([]);
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

  // Ajoute la fonction renderStep4 pour l'étape 4 (accompagnateurs, fichiers multiples, prix, drag & drop)
  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations sur les accompagnateurs</h3>
      <AccompaniersFields />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Justificatifs (obligatoire, images ou PDF, plusieurs fichiers possibles)</label>
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
              const files = e.target.files;
              if (files && files.length > 0) {
                setUploadedFiles(prev => [...prev, ...Array.from(files)]);
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
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
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
                    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
                  }}
                  className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-100"
                  title="Supprimer"
                >✕</button>
              </li>
            ))}
          </ul>
        )}
        {isSubmitting && uploadedFiles.length === 0 && (
          <p className="text-red-500 text-xs mt-1">Au moins un fichier justificatif est obligatoire.</p>
        )}
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-800 text-center">
        <span className="font-semibold">Prix du service :</span> {prixActe !== null ? prixActe + ' €' : 'Non disponible'}
      </div>
    </div>
  );

  // Composant pour gérer la liste des accompagnateurs
  function AccompaniersFields() {
    // Objet accompagnateur vide complet
    const emptyAcc = { firstName: '', lastName: '', birthDate: '', birthPlace: '', nationality: '', domicile: '' };
    const [fields, setFields] = useState<Array<typeof emptyAcc>>([{ ...emptyAcc }]);

    // Synchronise avec react-hook-form à chaque changement de fields
    useEffect(() => {
      setValue('accompaniers', fields);
    }, [fields, setValue]);

    const handleChange = (idx: number, key: keyof typeof emptyAcc, value: string) => {
      const updated = fields.map((item, i) => i === idx ? { ...item, [key]: value } : item);
      setFields(updated);
    };
    const addAccompagnateur = () => setFields([...fields, { ...emptyAcc }]);
    const removeAccompagnateur = (idx: number) => setFields(fields.length > 1 ? fields.filter((_, i) => i !== idx) : [{ ...emptyAcc }]);

    return (
      <div className="space-y-4">
        {fields.map((acc, idx) => (
          <div key={idx} className="border p-4 rounded-md relative bg-gray-50">
            <button type="button" onClick={() => removeAccompagnateur(idx)} className="absolute top-2 right-2 text-red-500">✕</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                <input
                  value={acc.firstName}
                  onChange={e => handleChange(idx, 'firstName', e.target.value)}
                  placeholder="Ex: Amina"
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  value={acc.lastName}
                  onChange={e => handleChange(idx, 'lastName', e.target.value)}
                  placeholder="Ex: Mahamat"
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
                <input
                  type="date"
                  value={acc.birthDate}
                  onChange={e => handleChange(idx, 'birthDate', e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance *</label>
                <input
                  value={acc.birthPlace}
                  onChange={e => handleChange(idx, 'birthPlace', e.target.value)}
                  placeholder="Ex: N'Djamena"
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité *</label>
                <input
                  value={acc.nationality}
                  onChange={e => handleChange(idx, 'nationality', e.target.value)}
                  placeholder="Ex: Tchadienne"
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domicile</label>
                <input
                  value={acc.domicile}
                  onChange={e => handleChange(idx, 'domicile', e.target.value)}
                  placeholder="Ex: 12 rue de N'Djamena"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={addAccompagnateur} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md">Ajouter un accompagnateur</button>
      </div>
    );
  }

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

  return (
    <form onSubmit={handleSubmit(onSubmit as any)}>
      {renderProgressBar()}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && accompaniedValue && renderStep4()}
      {renderNavigation()}
    </form>
  );
}
