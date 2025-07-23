'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { visaRequestDetailsSchema } from '@/lib/validation/details-request.validation';
import type { z } from 'zod';
import { Gender, MaritalStatus, PassportType, VisaType } from '@/types/request.types';
import { visaApi } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

type VisaFormInput = z.infer<typeof visaRequestDetailsSchema> & { contactPhoneNumber: string };

interface Document {
  id: number;
  name: string;
  url: string;
}

interface RequestWithRelations {
  contactPhoneNumber?: string;
  documents?: Document[];
}

interface VisaFormProps {
  request: RequestWithRelations;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const REQUIRED_FIELDS: (keyof VisaFormInput)[] = [
  'personFirstName',
  'personLastName',
  'personGender',
  'personNationality',
  'personBirthDate',
  'personBirthPlace',
  'personMaritalStatus',
  'passportType',
  'passportNumber',
  'passportIssuedBy',
  'passportIssueDate',
  'passportExpirationDate',
  'visaType',
  'durationMonths',
  'contactPhoneNumber'
];

export default function VisaForm({ request, onSuccess, onError }: VisaFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const totalSteps = 4;
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(5);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm({
    resolver: zodResolver(visaRequestDetailsSchema) as any,
    mode: 'onBlur',
    defaultValues: {
      requestId: crypto.randomUUID(),
      contactPhoneNumber: '',
      personFirstName: '',
      personLastName: '',
      personGender: undefined,
      personNationality: '',
      personBirthDate: '',
      personBirthPlace: '',
      personMaritalStatus: undefined,
      passportType: undefined,
      passportNumber: '',
      passportIssuedBy: '',
      passportIssueDate: '',
      passportExpirationDate: '',
      profession: '',
      employerAddress: '',
      employerPhoneNumber: '',
      durationMonths: 1,
      destinationState: '',
      visaType: undefined,
    },
  });

  // Calcul du prix en fonction de la durée
  const durationMonths = watch('durationMonths');
  const prixVisa = durationMonths && durationMonths > 3 ? 70000 : 35000;

  // Synchronisation automatique du type de visa
  useEffect(() => {
    if (typeof durationMonths === 'number') {
      const visaType = durationMonths <= 3 ? VisaType.SHORT_STAY : VisaType.LONG_STAY;
      setValue('visaType', visaType as any);
      trigger('visaType');
    }
  }, [durationMonths, setValue, trigger]);

  const isFieldRequired = (fieldName: keyof VisaFormInput): boolean => {
    return REQUIRED_FIELDS.includes(fieldName);
  };

  const FieldLabel = ({ name, label }: { name: keyof VisaFormInput; label: string }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {isFieldRequired(name) && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFieldsForStep = (step: number): (keyof VisaFormInput)[] => {
    switch (step) {
      case 1: return ['personFirstName', 'personLastName', 'personGender', 'personNationality', 'personBirthDate', 'personBirthPlace', 'personMaritalStatus'];
      case 2: return ['passportType', 'passportNumber', 'passportIssuedBy', 'passportIssueDate', 'passportExpirationDate'];
      case 3: return ['profession', 'employerAddress', 'employerPhoneNumber', 'durationMonths', 'destinationState', 'visaType']; // 'visaExpirationDate' retiré car optionnel
      case 4: return ['contactPhoneNumber'];
      default: return [];
    }
  };

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const valid = await trigger(fields as Parameters<typeof trigger>[0]);
    if (valid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: VisaFormInput) => {
    setIsSubmitting(true);
    // Retirer contactPhoneNumber de visaDetails
    const { contactPhoneNumber, ...visaDetails } = data;
    try {
      const result = await visaApi.create(
        visaDetails, // sans contactPhoneNumber
        contactPhoneNumber, // à la racine
        uploadedFiles,
        localStorage.getItem('auth-token') || ''
      );
      
      if (result.success) {
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
      } else {
        onError?.(result.error || 'Erreur lors de la création de la demande');
      }
    } catch (error) {
      onError?.('Une erreur inattendue s\'est produite');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FieldLabel name="personFirstName" label="Prénom" />
          <input
            {...register('personFirstName')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personFirstName && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {errors.personFirstName.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="personLastName" label="Nom" />
          <input
            {...register('personLastName')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personLastName && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {errors.personLastName.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="personGender" label="Genre" />
          <select
            {...register('personGender')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionnez...</option>
            {Object.values(Gender).map((gender) => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
          {errors.personGender && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {errors.personGender.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="personNationality" label="Nationalité" />
          <input
            {...register('personNationality')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personNationality && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {errors.personNationality.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="personBirthDate" label="Date de naissance" />
          <input
            type="date"
            {...register('personBirthDate')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personBirthDate && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {errors.personBirthDate.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="personBirthPlace" label="Lieu de naissance" />
          <input
            {...register('personBirthPlace')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personBirthPlace && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {errors.personBirthPlace.message}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <FieldLabel name="personMaritalStatus" label="Statut matrimonial" />
        <select
          {...register('personMaritalStatus')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Sélectionnez...</option>
          {Object.values(MaritalStatus).map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        {errors.personMaritalStatus && (
          <div className="flex items-center mt-1 text-red-600 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
            </svg>
            {errors.personMaritalStatus.message}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations du passeport</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FieldLabel name="passportType" label="Type de passeport" />
          <select
            {...register('passportType')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionnez...</option>
            {Object.values(PassportType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.passportType && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {errors.passportType.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="passportNumber" label="Numéro de passeport" />
          <input
            {...register('passportNumber')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.passportNumber && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {errors.passportNumber.message}
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <FieldLabel name="passportIssuedBy" label="Pays de délivrance" />
          <input
            {...register('passportIssuedBy')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.passportIssuedBy && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {errors.passportIssuedBy.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="passportIssueDate" label="Date de délivrance" />
          <input
            type="date"
            {...register('passportIssueDate')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.passportIssueDate && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {errors.passportIssueDate.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="passportExpirationDate" label="Date d'expiration" />
          <input
            type="date"
            {...register('passportExpirationDate')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.passportExpirationDate && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {errors.passportExpirationDate.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations professionnelles et visa</h3>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <FieldLabel name="profession" label="Profession" />
          <input
            {...register('profession')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.profession && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {errors.profession.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="employerAddress" label="Adresse de l'employeur" />
          <textarea
            {...register('employerAddress')}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.employerAddress && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {errors.employerAddress.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="employerPhoneNumber" label="Téléphone de l'employeur" />
          <input
            {...register('employerPhoneNumber')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.employerPhoneNumber && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {errors.employerPhoneNumber.message}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FieldLabel name="durationMonths" label="Durée du séjour (mois)" />
            <input
              type="number"
              min="1"
              max="60"
              {...register('durationMonths', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.durationMonths && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
                </svg>
                {errors.durationMonths.message}
              </div>
            )}
          </div>
          <div>
            <FieldLabel name="destinationState" label="Ville de destination" />
            <input
              {...register('destinationState')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.destinationState && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
                </svg>
                {errors.destinationState.message}
              </div>
            )}
          </div>
        </div>
        <div>
          <FieldLabel name="visaType" label="Type de visa" />
          <input
            {...register('visaType')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            readOnly
            value={watch('visaType') || ''}
            tabIndex={-1}
          />
          {errors.visaType && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {errors.visaType.message}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end mt-4">
        <span className="text-lg font-semibold text-green-700">
          Prix à payer : {prixVisa.toLocaleString()} FCFA
        </span>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact et documents</h3>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <FieldLabel name="contactPhoneNumber" label="Numéro de téléphone" />
          <input
            {...register('contactPhoneNumber')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.contactPhoneNumber && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {errors.contactPhoneNumber.message}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Documents à joindre <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                </p>
                <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 10MB)</p>
              </div>
              <input 
                type="file" 
                multiple 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                  <button 
                    type="button"
                    onClick={() => removeUploadedFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Demande de Visa</h1>
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

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

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