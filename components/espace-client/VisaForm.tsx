'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { visaFormSchema, type VisaFormInput } from '@/src/schemas/visa-request.schemas';
import { Gender, MaritalStatus, PassportType, VisaType } from '@/types/visa-request.types';
import { createVisaRequestWithFormData } from '@/src/actions/visa-request.action';
import { Button, Input, Select, SelectItem, Textarea, Card, CardBody, CardHeader, Divider, Progress } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

interface VisaFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function VisaForm({ onSuccess, onError }: VisaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const router = useRouter();
  const locale = useLocale();

  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
  } = useForm<VisaFormInput>({
    resolver: zodResolver(visaFormSchema),
    mode: 'onChange',
    defaultValues: {
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
      contactPhoneNumber: '',
    },
  });

  const watchedValues = watch();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValidStep = await trigger(fieldsToValidate);
    
    if (isValidStep && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof VisaFormInput)[] => {
    switch (step) {
      case 1:
        return ['personFirstName', 'personLastName', 'personGender', 'personNationality', 'personBirthDate', 'personBirthPlace', 'personMaritalStatus'];
      case 2:
        return ['passportType', 'passportNumber', 'passportIssuedBy', 'passportIssueDate', 'passportExpirationDate'];
      case 3:
        return ['profession', 'employerAddress', 'employerPhoneNumber', 'durationMonths', 'destinationState'];
      case 4:
        return ['contactPhoneNumber'];
      default:
        return [];
    }
  };

  // Fonction pour normaliser les dates (accepte jj/mm/yyyy ou yyyy-mm-dd)
  function normalizeDate(dateStr: string) {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  }

  const onSubmit = async (data: VisaFormInput) => {
    setIsSubmitting(true);

    // Normalisation des dates
    const normalizedData = {
      ...data,
      personBirthDate: normalizeDate(data.personBirthDate),
      passportIssueDate: normalizeDate(data.passportIssueDate),
      passportExpirationDate: normalizeDate(data.passportExpirationDate),
    };

    // Calcul automatique du visaType
    const duration = Number(normalizedData.durationMonths);
    const visaType = duration <= 3 ? VisaType.SHORT_STAY : VisaType.LONG_STAY;

    // Ajoute visaType dans visaDetails
    const visaDetails = {
      ...normalizedData,
      visaType,
    };

    try {
      const result = await createVisaRequestWithFormData(
        visaDetails,
        normalizedData.contactPhoneNumber,
        uploadedFiles
      );
      console.log('Résultat de la soumission:', result);
      if (result.success) {
        console.log('Redirection vers la liste des demandes');
        onSuccess?.();
        router.push(`/${locale}/espace-client/mes-demandes?success=true`);
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
      <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('personFirstName')}
          label="Prénom"
          placeholder="Votre prénom"
          isInvalid={!!errors.personFirstName}
          errorMessage={errors.personFirstName?.message}
          variant="bordered"
        />
        
        <Input
          {...register('personLastName')}
          label="Nom"
          placeholder="Votre nom"
          isInvalid={!!errors.personLastName}
          errorMessage={errors.personLastName?.message}
          variant="bordered"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          {...register('personGender')}
          label="Genre"
          placeholder="Sélectionnez votre genre"
          isInvalid={!!errors.personGender}
          errorMessage={errors.personGender?.message}
          variant="bordered"
        >
          <SelectItem key={Gender.MALE}>Masculin</SelectItem>
          <SelectItem key={Gender.FEMALE}>Féminin</SelectItem>
        </Select>

        <Input
          {...register('personNationality')}
          label="Nationalité"
          placeholder="Votre nationalité"
          isInvalid={!!errors.personNationality}
          errorMessage={errors.personNationality?.message}
          variant="bordered"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('personBirthDate')}
          label="Date de naissance"
          type="date"
          isInvalid={!!errors.personBirthDate}
          errorMessage={errors.personBirthDate?.message}
          variant="bordered"
        />

        <Input
          {...register('personBirthPlace')}
          label="Lieu de naissance"
          placeholder="Ville, pays"
          isInvalid={!!errors.personBirthPlace}
          errorMessage={errors.personBirthPlace?.message}
          variant="bordered"
        />
      </div>

      <Select
        {...register('personMaritalStatus')}
        label="Statut matrimonial"
        placeholder="Sélectionnez votre statut"
        isInvalid={!!errors.personMaritalStatus}
        errorMessage={errors.personMaritalStatus?.message}
        variant="bordered"
      >
        <SelectItem key={MaritalStatus.SINGLE}>Célibataire</SelectItem>
        <SelectItem key={MaritalStatus.MARRIED}>Marié(e)</SelectItem>
        <SelectItem key={MaritalStatus.DIVORCED}>Divorcé(e)</SelectItem>
        <SelectItem key={MaritalStatus.WIDOWED}>Veuf/Veuve</SelectItem>
      </Select>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Informations du passeport</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          {...register('passportType')}
          label="Type de passeport"
          placeholder="Sélectionnez le type"
          isInvalid={!!errors.passportType}
          errorMessage={errors.passportType?.message}
          variant="bordered"
        >
          <SelectItem key={PassportType.ORDINARY}>Ordinaire</SelectItem>
          <SelectItem key={PassportType.DIPLOMATIC}>Diplomatique</SelectItem>
          <SelectItem key={PassportType.SERVICE}>Service</SelectItem>
        </Select>

        <Input
          {...register('passportNumber')}
          label="Numéro de passeport"
          placeholder="Numéro du passeport"
          isInvalid={!!errors.passportNumber}
          errorMessage={errors.passportNumber?.message}
          variant="bordered"
        />
      </div>

      <Input
        {...register('passportIssuedBy')}
        label="Pays de délivrance"
        placeholder="Pays qui a délivré le passeport"
        isInvalid={!!errors.passportIssuedBy}
        errorMessage={errors.passportIssuedBy?.message}
        variant="bordered"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('passportIssueDate')}
          label="Date de délivrance"
          type="date"
          isInvalid={!!errors.passportIssueDate}
          errorMessage={errors.passportIssueDate?.message}
          variant="bordered"
        />

        <Input
          {...register('passportExpirationDate')}
          label="Date d'expiration"
          type="date"
          isInvalid={!!errors.passportExpirationDate}
          errorMessage={errors.passportExpirationDate?.message}
          variant="bordered"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Informations professionnelles et visa</h3>
      
      <Input
        {...register('profession')}
        label="Profession"
        placeholder="Votre profession actuelle"
        isInvalid={!!errors.profession}
        errorMessage={errors.profession?.message}
        variant="bordered"
      />

      <Textarea
        {...register('employerAddress')}
        label="Adresse de l'employeur"
        placeholder="Adresse complète de votre employeur"
        isInvalid={!!errors.employerAddress}
        errorMessage={errors.employerAddress?.message}
        variant="bordered"
      />

      <Input
        {...register('employerPhoneNumber')}
        label="Téléphone de l'employeur"
        placeholder="+33 1 42 56 48 75"
        isInvalid={!!errors.employerPhoneNumber}
        errorMessage={errors.employerPhoneNumber?.message}
        variant="bordered"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('durationMonths', { valueAsNumber: true })}
          label="Durée du séjour (mois)"
          type="number"
          min="1"
          max="60"
          isInvalid={!!errors.durationMonths}
          errorMessage={errors.durationMonths?.message}
          variant="bordered"
        />

        <Input
          {...register('destinationState')}
          label="Ville de destination"
          placeholder="Ville où vous séjournerez"
          isInvalid={!!errors.destinationState}
          errorMessage={errors.destinationState?.message}
          variant="bordered"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Contact et documents</h3>
      
      <Input
        {...register('contactPhoneNumber')}
        label="Numéro de téléphone de contact"
        placeholder="+33 1 42 56 48 75"
        isInvalid={!!errors.contactPhoneNumber}
        errorMessage={errors.contactPhoneNumber?.message}
        variant="bordered"
      />

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Documents à joindre (PDF, JPG, PNG)
        </label>
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Fichiers sélectionnés :</p>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">{file.name}</span>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={() => removeFile(index)}
                >
                  Supprimer
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-0">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Demande de Visa</h2>
          <Progress
            value={(currentStep / totalSteps) * 100}
            className="w-full"
            color="primary"
          />
          <p className="text-sm text-gray-600 mt-2">
            Étape {currentStep} sur {totalSteps}
          </p>
          <button type="button" onClick={() => { console.log('Test bouton redirection'); router.push('/espace-client/mes-demandes'); }} style={{marginTop:8, padding:4, background:'#eee', borderRadius:4}}>
            Test Redirection
          </button>
        </div>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderCurrentStep()}

          <Divider />

          <div className="flex justify-between">
            <Button
              type="button"
              variant="bordered"
              onPress={prevStep}
              isDisabled={currentStep === 1}
            >
              Précédent
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                color="primary"
                onPress={nextStep}
              >
                Suivant
              </Button>
            ) : (
              <Button
                type="submit"
                color="primary"
                isLoading={isSubmitting}
                isDisabled={!isValid}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
              </Button>
            )}
          </div>
        </form>
      </CardBody>
    </Card>
  );
} 