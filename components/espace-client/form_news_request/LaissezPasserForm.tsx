import { FieldError, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { laissezPasserRequestDetailsSchema } from '@/lib/validation/details-request.validation';
import type { z } from 'zod';
import React, { useState } from "react";
type LaissezPasserFormInput = z.infer<typeof laissezPasserRequestDetailsSchema> & { contactPhoneNumber: string };

export default function LaissezPasserForm() {
  const { register, handleSubmit, formState: { errors }, setValue, trigger, watch } = useForm<LaissezPasserFormInput>({
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
      accompanierFirstName: '',
      accompanierLastName: '',
      accompanierBirthDate: '',
      accompanierBirthPlace: '',
      accompanierNationality: '',
      accompanierDomicile: '',
    },
  });

  const totalSteps = 5;
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [prix, setPrix] = useState(10000); // ou récupère dynamiquement si besoin

  function getFieldsForStep(step: number): (keyof LaissezPasserFormInput)[] {
    switch (step) {
      case 1:
        return ['personFirstName', 'personLastName', 'personBirthDate', 'personBirthPlace'];
      case 2:
        return ['personNationality', 'personDomicile', 'fatherFullName', 'motherFullName'];
      case 3:
        return ['destination', 'travelReason', 'accompanied', 'laissezPasserExpirationDate', 'accompanierFirstName', 'accompanierLastName', 'accompanierBirthDate', 'accompanierBirthPlace', 'accompanierNationality', 'accompanierDomicile'];
      case 4:
        return ['justificationDocumentType', 'justificationDocumentNumber', 'contactPhoneNumber'];
      case 5:
        return [];
      default:
        return [];
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValidStep = await trigger(fieldsToValidate as Parameters<typeof trigger>[0]);
    if (isValidStep && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStep3 = () => {
    const accompaniedValue = watch('accompanied');
    // Récupère les erreurs des champs de l'étape 3
    const step3Fields = [
      'destination',
      'travelReason',
      'accompanied',
      'laissezPasserExpirationDate',
      'accompanierFirstName',
      'accompanierLastName',
      'accompanierBirthDate',
      'accompanierBirthPlace',
      'accompanierNationality',
      'accompanierDomicile',
    ];
    const step3Errors = step3Fields
      .map(field => errors[field as keyof typeof errors])
      .filter(Boolean) as FieldError[];
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Voyage et validité</h3>
        {step3Errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
            <strong>Veuillez corriger les erreurs suivantes :</strong>
            <ul className="list-disc ml-5 mt-1">
              {step3Errors.map((err, idx) => (
                <li key={idx}>{err.message}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input {...register('destination')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Destination" />
            {errors.destination && <p className="text-red-500 text-xs">{errors.destination.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motif du voyage</label>
            <input {...register('travelReason')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Motif du voyage" />
            {errors.travelReason && <p className="text-red-500 text-xs">{errors.travelReason.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accompagné(e)</label>
            <select {...register('accompanied', { setValueAs: v => v === 'true' })} defaultValue="" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value="">Sélectionnez</option>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valable jusqu'au</label>
            <input type="date" {...register('laissezPasserExpirationDate')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Date d'expiration" />
            {errors.laissezPasserExpirationDate && <p className="text-red-500 text-xs">{errors.laissezPasserExpirationDate.message}</p>}
          </div>
        </div>
        {accompaniedValue === true && (
          <div className="mt-8 p-4 border rounded-lg bg-gray-50">
            <h4 className="text-md font-semibold text-gray-800 mb-4">Informations sur l'accompagnateur</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom <span className="text-red-500">*</span></label>
                <input 
                  {...register('accompanierFirstName')} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Prénom de l'accompagnateur" 
                />
                {errors.accompanierFirstName && <p className="text-red-500 text-xs">{errors.accompanierFirstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom <span className="text-red-500">*</span></label>
                <input 
                  {...register('accompanierLastName')} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Nom de l'accompagnateur" 
                />
                {errors.accompanierLastName && <p className="text-red-500 text-xs">{errors.accompanierLastName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  {...register('accompanierBirthDate')} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Date de naissance de l'accompagnateur" 
                />
                {errors.accompanierBirthDate && <p className="text-red-500 text-xs">{errors.accompanierBirthDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance <span className="text-red-500">*</span></label>
                <input 
                  {...register('accompanierBirthPlace')} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Lieu de naissance de l'accompagnateur" 
                />
                {errors.accompanierBirthPlace && <p className="text-red-500 text-xs">{errors.accompanierBirthPlace.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité <span className="text-red-500">*</span></label>
                <input 
                  {...register('accompanierNationality')} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Nationalité de l'accompagnateur" 
                />
                {errors.accompanierNationality && <p className="text-red-500 text-xs">{errors.accompanierNationality.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domicile <span className="text-red-500">*</span></label>
                <input 
                  {...register('accompanierDomicile')} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Domicile de l'accompagnateur" 
                />
                {errors.accompanierDomicile && <p className="text-red-500 text-xs">{errors.accompanierDomicile.message}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom <span className="text-red-500">*</span></label>
          <input {...register('personFirstName')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Entrez le prénom" />
          {errors.personFirstName && <p className="text-red-500 text-xs">{errors.personFirstName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom <span className="text-red-500">*</span></label>
          <input {...register('personLastName')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Entrez le nom" />
          {errors.personLastName && <p className="text-red-500 text-xs">{errors.personLastName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance <span className="text-red-500">*</span></label>
          <input type="date" {...register('personBirthDate')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Date de naissance" />
          {errors.personBirthDate && <p className="text-red-500 text-xs">{errors.personBirthDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance <span className="text-red-500">*</span></label>
          <input {...register('personBirthPlace')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Ville, pays de naissance" />
          {errors.personBirthPlace && <p className="text-red-500 text-xs">{errors.personBirthPlace.message}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nationalité et filiation</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité <span className="text-red-500">*</span></label>
          <input {...register('personNationality')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Nationalité" />
          {errors.personNationality && <p className="text-red-500 text-xs">{errors.personNationality.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Domicile (optionnel)</label>
          <input {...register('personDomicile')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Domicile (optionnel)" />
          {errors.personDomicile && <p className="text-red-500 text-xs">{errors.personDomicile.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du père</label>
          <input {...register('fatherFullName')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Nom du père" />
          {errors.fatherFullName && <p className="text-red-500 text-xs">{errors.fatherFullName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la mère</label>
          <input {...register('motherFullName')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Nom de la mère" />
          {errors.motherFullName && <p className="text-red-500 text-xs">{errors.motherFullName.message}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Justificatif et contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type de pièce justificative</label>
          <input {...register('justificationDocumentType')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Type de pièce" />
          {errors.justificationDocumentType && <p className="text-red-500 text-xs">{errors.justificationDocumentType.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de pièce justificative</label>
          <input {...register('justificationDocumentNumber')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Numéro de pièce" />
          {errors.justificationDocumentNumber && <p className="text-red-500 text-xs">{errors.justificationDocumentNumber.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact <span className="text-red-500">*</span></label>
          <input {...register('contactPhoneNumber')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Numéro de téléphone" />
          {errors.contactPhoneNumber && <p className="text-red-500 text-xs">{errors.contactPhoneNumber.message}</p>}
        </div>
        {/* Ajoute ici l'upload de fichiers si besoin */}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif et paiement</h3>
      <div className="mb-4">
        <span className="text-lg font-semibold text-green-700">Prix à payer : {prix.toLocaleString()} FCFA</span>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Image à uploader (photo, justificatif, etc.)</label>
        <input type="file" accept="image/*" onChange={e => setUploadedFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        {uploadedFile && <div className="mt-2 text-sm text-gray-700">Fichier sélectionné : {uploadedFile.name}</div>}
      </div>
    </div>
  );

  // Ajoute le return principal
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Formulaire de demande de Laissez-passer</h1>
      <form>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        <div className="flex justify-between items-center mt-6">
          {currentStep > 1 && (
            <button type="button" onClick={() => setCurrentStep(currentStep - 1)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Précédent</button>
          )}
          {currentStep < totalSteps && (
            <button type="button" onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Suivant</button>
          )}
          {currentStep === totalSteps && (
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Soumettre la demande</button>
          )}
        </div>
      </form>
    </div>
  );
}