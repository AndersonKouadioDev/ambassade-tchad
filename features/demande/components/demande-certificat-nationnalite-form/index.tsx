"use client";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import React from "react";
import { toast } from "sonner";
import { PaysParentType } from "../../types/certificat-nationalite.type";
import { useServicesPricesQuery } from "../../queries/demande-services.query";
import { formatCurrency } from "@/utils/format-currency";
import {
  CertificatNationaliteDetailsDTO,
  CertificatNationaliteDetailsSchema,
} from "../../schema/certificat-nationalite.schema";
import { useFileUpload } from "@/hooks/use-file-upload";
import FileUploadView from "@/components/block/file-upload-view";
import { useCertificatNationaliteCreateMutation } from "../../queries/certificat-nationalite.mutation";
import { useMultistepForm } from "@/hooks/use-multistep-form";
import { InputField } from "@/components/form/input-field";
import FormContainer from "@/components/form/multi-step/form-container";

interface Props {
  documentsSize: number;
}

export default function CertificatNationaliteForm({ documentsSize }: Props) {
  // Validation du formulaire
  const { Field, handleSubmit, validateField, getAllErrors } = useForm({
    defaultValues: {
      //   serviceType: ServiceType.NATIONALITY_CERTIFICATE,
      applicantFirstName: "John",
      applicantLastName: "Doe",
      applicantBirthDate: "1990-01-01",
      applicantBirthPlace: "New York",
      applicantNationality: "United States",
      originCountryParentFirstName: "John",
      originCountryParentLastName: "Doe",
      originCountryParentRelationship: PaysParentType.FATHER,
      contactPhoneNumber: "+11234567890",
      documents: [],
    } as CertificatNationaliteDetailsDTO,
    validationLogic: revalidateLogic({
      mode: "change",
    }),
    validators: {
      onChange: CertificatNationaliteDetailsSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const {
    currentStep,
    totalSteps,
    showSuccess,
    successCountdown,
    showSuccessAndRedirect,
    successComponent,
    nextStep,
    prevStep,
  } = useMultistepForm({
    totalSteps: 3,
    redirectPath: "/espace-client/mes-demandes?success=true",
    successCountdownDuration: 5,
  });

  const maxFiles = 10;
  const maxSizeMB = 20;
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize: maxSizeMB * 1024 * 1024,
    initialFiles: [],
  });

  //   Récupération du prix dynamique
  const { data: servicesPrices, isLoading: servicesPricesLoading } =
    useServicesPricesQuery();

  // Création de la demande
  const {
    mutateAsync: createCertificatNationalite,
    isPending: createCertificatNationaliteLoading,
  } = useCertificatNationaliteCreateMutation();

  const isLoading = servicesPricesLoading || createCertificatNationaliteLoading;

  const currentServicePrice = servicesPrices?.find(
    (service) => service.type === "NATIONALITY_CERTIFICATE"
  );
  const prixActe = currentServicePrice?.defaultPrice;

  // Fonction pour valider les champs d'une étape spécifique
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof CertificatNationaliteDetailsDTO)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "applicantFirstName",
          "applicantLastName",
          "applicantBirthDate",
          "applicantBirthPlace",
          "applicantNationality",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "originCountryParentFirstName",
          "originCountryParentLastName",
          "originCountryParentRelationship",
        ];
        break;
      case 3:
        fieldsToValidate = ["contactPhoneNumber"];
        break;
      default:
        return true;
    }

    // Valider chaque champ de l'étape
    let isValid = true;
    for (const fieldName of fieldsToValidate) {
      try {
        await validateField(fieldName, "change");
      } catch (validationError: any) {
        isValid = false;
        const errorMessage =
          validationError?.message || `Erreur de validation pour ${fieldName}`;
        toast.error(errorMessage);
      }
    }

    const errors = getAllErrors();
    if (Object.keys(errors.fields).length > 0) {
      isValid = false;
    }

    return isValid;
  };

  const handleNext = () => {
    nextStep(validateStep);
  };

  const onSubmit = async (data: CertificatNationaliteDetailsDTO) => {
    const uploadedFiles = files.map((file) => file.file as File);

    const dataForSubmit: CertificatNationaliteDetailsDTO = {
      ...data,
      documents: uploadedFiles,
    };
    // Validation finale avant soumission
    if (uploadedFiles.length < documentsSize) {
      toast.error(
        `Veuillez télécharger tous ${documentsSize} documents requis`
      );
      return;
    }

    try {
      await createCertificatNationalite({ data: dataForSubmit });
      showSuccessAndRedirect();
    } catch (error) {}
  };

  const fieldsStep1: {
    name: keyof Omit<CertificatNationaliteDetailsDTO, "documents">;
    label: string;
    type?: string;
  }[] = [
    { name: "applicantFirstName", label: "Prénom *", type: "text" },
    { name: "applicantLastName", label: "Nom *", type: "text" },
    { name: "applicantBirthDate", label: "Date de naissance *", type: "date" },
    { name: "applicantBirthPlace", label: "Lieu de naissance *", type: "text" },
    { name: "applicantNationality", label: "Nationalité *", type: "text" },
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Informations personnelles
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep1.map((item) => (
          <Field key={item.name} name={item.name}>
            {({ state, handleChange, handleBlur }) => (
              <InputField
                label={item.label}
                placeholder="Ex: Mahamat"
                type={item.type}
                value={state.value}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={state.meta.errors![0]?.message}
              />
            )}
          </Field>
        ))}
      </div>
    </div>
  );

  const fieldsStep2: {
    name: keyof Omit<CertificatNationaliteDetailsDTO, "documents">;
    label: string;
    type?: string;
  }[] = [
    { name: "originCountryParentFirstName", label: "Prénom *", type: "text" },
    { name: "originCountryParentLastName", label: "Nom *", type: "text" },
  ];

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Informations sur le parent d'origine et contact
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep2.map((item) => (
          <Field key={item.name} name={item.name}>
            {({ state, handleChange, handleBlur }) => (
              <InputField
                label={item.label}
                placeholder="Ex: Mahamat"
                type={item.type}
                value={state.value}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={state.meta.errors![0]?.message}
              />
            )}
          </Field>
        ))}

        <Field name="originCountryParentRelationship">
          {({ state, handleChange, handleBlur }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lien de parenté *
              </label>
              <select
                value={state.value}
                onChange={(e) => handleChange(e.target.value as PaysParentType)}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-md ${
                  state.meta.errors?.length
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value={PaysParentType.FATHER}>Père</option>
                <option value={PaysParentType.MOTHER}>Mère</option>
              </select>
              {state.meta.errors?.length > 0 && (
                <p className="text-red-500 text-xs mt-1">
                  {state.meta.errors![0]?.message}
                </p>
              )}
            </div>
          )}
        </Field>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Récapitulatif et pièce justificative
      </h3>
      <div className="mb-4">
        <span className="text-lg font-semibold text-green-700">
          Prix à payer : {formatCurrency(prixActe ?? 5000)}
        </span>
      </div>
      <div className="mb-4">
        <FileUploadView
          maxFiles={maxFiles}
          maxSizeMB={maxSizeMB}
          openFileDialog={openFileDialog}
          handleDragEnter={handleDragEnter}
          handleDragLeave={handleDragLeave}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          files={files}
          isDragging={isDragging}
          errors={errors}
          removeFile={removeFile}
          clearFiles={clearFiles}
          getInputProps={getInputProps}
        />
      </div>
      <div className="mb-4">
        <Field name="contactPhoneNumber">
          {({ state, handleChange, handleBlur }) => (
            <InputField
              label="Numéro de contact *"
              placeholder="Ex: +225 01 23 45 67 89"
              type="text"
              value={state.value}
              onChange={handleChange}
              onBlur={handleBlur}
              errors={state.meta.errors![0]?.message}
            />
          )}
        </Field>
      </div>
    </div>
  );

  if (showSuccess) {
    return successComponent(successCountdown);
  }

  return (
    <FormContainer
      title="Formulaire de demande de Certificat de Nationalité"
      currentStep={currentStep}
      totalSteps={totalSteps}
      handleSubmit={handleSubmit}
      prevStep={prevStep}
      handleNext={handleNext}
      isLoading={isLoading}
    >
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
    </FormContainer>
  );
}
