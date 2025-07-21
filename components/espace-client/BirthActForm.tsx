'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createDemande } from '@/src/actions/demande-request.action';
import { Button, Input, Card, CardBody, CardHeader, Divider, Progress, Select, SelectItem } from '@heroui/react';
import { birthActFormSchema, BirthActFormInput } from '@/src/schemas/birth-act.schemas';

const requestTypes = [
  { value: 'EXTRAIT', label: 'Extrait' },
  { value: 'COPIE_LITTERALE', label: 'Copie littérale' },
];
const genderOptions = [
  { value: 'MALE', label: 'Masculin' },
  { value: 'FEMALE', label: 'Féminin' },
];

function normalizeDate(dateStr: string) {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`).toISOString();
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr).toISOString();
  }
  return dateStr;
}

export default function BirthActForm() {
  const { data: session } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
  } = useForm<BirthActFormInput>({
    resolver: zodResolver(birthActFormSchema),
    mode: 'onChange',
    defaultValues: {
      personFirstName: '',
      personLastName: '',
      personBirthDate: '',
      personBirthPlace: '',
      personNationality: '',
      personDomicile: '',
      fatherFullName: '',
      motherFullName: '',
      requestType: undefined,
      personGender: undefined,
    },
  });

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

  const getFieldsForStep = (step: number): (keyof BirthActFormInput)[] => {
    switch (step) {
      case 1:
        return ['personFirstName', 'personLastName', 'personBirthDate', 'personBirthPlace', 'personNationality', 'personDomicile'];
      case 2:
        return ['fatherFullName', 'motherFullName'];
      case 3:
        return ['requestType', 'personGender'];
      default:
        return [];
    }
  };

  const onSubmit = async (data: BirthActFormInput) => {
    setIsSubmitting(true);
    try {
      const birthDate = normalizeDate(data.personBirthDate);
      const details: Record<string, any> = {
        personFirstName: data.personFirstName,
        personLastName: data.personLastName,
        personBirthDate: birthDate,
        personBirthPlace: data.personBirthPlace,
        personNationality: data.personNationality,
        fatherFullName: data.fatherFullName,
        motherFullName: data.motherFullName,
        requestType: data.requestType,
      };
      if (data.personDomicile) details.personDomicile = data.personDomicile;
      if (data.personGender) details.personGender = data.personGender;
      const result = await createDemande({
        type: 'BIRTH_ACT_APPLICATION',
        details,
        contactPhoneNumber: '', // à remplir depuis un champ contact global si besoin
        documents: uploadedFiles,
        locale,
        tokenFromClient: session?.user?.token,
      });
      if (result.success) {
        router.push(`/${locale}/espace-client/mes-demandes?success=true`);
      } else {
        alert(result.error || 'Erreur lors de la création de la demande');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input {...register('personFirstName')} label="Prénom" placeholder="Votre prénom" isInvalid={!!errors.personFirstName} errorMessage={errors.personFirstName?.message} variant="bordered" maxLength={255} />
        <Input {...register('personLastName')} label="Nom" placeholder="Votre nom" isInvalid={!!errors.personLastName} errorMessage={errors.personLastName?.message} variant="bordered" maxLength={255} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input {...register('personBirthDate')} label="Date de naissance" type="date" isInvalid={!!errors.personBirthDate} errorMessage={errors.personBirthDate?.message} variant="bordered" />
        <Input {...register('personBirthPlace')} label="Lieu de naissance" placeholder="Ville, pays" isInvalid={!!errors.personBirthPlace} errorMessage={errors.personBirthPlace?.message} variant="bordered" maxLength={255} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input {...register('personNationality')} label="Nationalité" placeholder="Votre nationalité" isInvalid={!!errors.personNationality} errorMessage={errors.personNationality?.message} variant="bordered" maxLength={255} />
        <Input {...register('personDomicile')} label="Domicile (optionnel)" placeholder="Votre domicile" isInvalid={!!errors.personDomicile} errorMessage={errors.personDomicile?.message} variant="bordered" maxLength={255} />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Informations parentales</h3>
      <Input {...register('fatherFullName')} label="Nom complet du père" placeholder="Nom du père" isInvalid={!!errors.fatherFullName} errorMessage={errors.fatherFullName?.message} variant="bordered" maxLength={255} />
      <Input {...register('motherFullName')} label="Nom complet de la mère" placeholder="Nom de la mère" isInvalid={!!errors.motherFullName} errorMessage={errors.motherFullName?.message} variant="bordered" maxLength={255} />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Type de demande et genre</h3>
      <Select {...register('requestType')} label="Type de demande" placeholder="Sélectionnez le type" isInvalid={!!errors.requestType} errorMessage={errors.requestType?.message} variant="bordered">
        {requestTypes.map(rt => (
          <SelectItem key={rt.value}>{rt.label}</SelectItem>
        ))}
      </Select>
      <Select {...register('personGender')} label="Genre (optionnel)" placeholder="Sélectionnez le genre" isInvalid={!!errors.personGender} errorMessage={errors.personGender?.message} variant="bordered">
        <SelectItem key="">Non renseigné</SelectItem>
        {genderOptions.map(g => (
          <SelectItem key={g.value}>{g.label}</SelectItem>
        ))}
      </Select>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Documents et récapitulatif</h3>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Documents à joindre (PDF, JPG, PNG)</label>
        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Fichiers sélectionnés :</p>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">{file.name}</span>
                <Button size="sm" color="danger" variant="light" onPress={() => removeFile(index)}>Supprimer</Button>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Demande d'Acte de Naissance</h2>
          <Progress value={(currentStep / totalSteps) * 100} className="w-full" color="primary" />
          <p className="text-sm text-gray-600 mt-2">Étape {currentStep} sur {totalSteps}</p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderCurrentStep()}
          <Divider />
          <div className="flex justify-between">
            <Button type="button" variant="bordered" onPress={prevStep} isDisabled={currentStep === 1}>Précédent</Button>
            {currentStep < totalSteps ? (
              <Button type="button" color="primary" onPress={nextStep}>Suivant</Button>
            ) : (
              <Button type="submit" color="primary" isLoading={isSubmitting} isDisabled={!isValid}>{isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}</Button>
            )}
          </div>
        </form>
      </CardBody>
    </Card>
  );
} 