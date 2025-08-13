"use client";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import React from "react";
import { toast } from "sonner";
import { useServicesPricesQuery } from "../../queries/demande-services.query";
import { formatCurrency } from "@/utils/format-currency";
import { useFileUpload } from "@/hooks/use-file-upload";
import FileUploadView from "@/components/block/file-upload-view";
import { useMultistepForm } from "@/hooks/use-multistep-form";
import { InputField } from "@/components/form/input-field";
import FormContainer from "@/components/form/multi-step/form-container";
import { DecesDetailsDTO, DecesDetailsSchema } from "../../schema/deces.schema";
import { useCertificatDecesCreateMutation } from "../../queries/certificat-deces.mutation";

interface Props {
  documentsSize: number;
}

export default function CertificatDecesForm({ documentsSize }: Props) {
  // Validation du formulaire
  const { Field, handleSubmit, validateField, getAllErrors } = useForm({
    defaultValues: {
      deceasedFirstName: "John",
      deceasedLastName: "Doe",
      deceasedBirthDate: "2000-01-01",
      deceasedDeathDate: "2022-01-01",
      deceasedNationality: "Tchadienne",
      contactPhoneNumber: "+11234567890",
      documents: [],
    } as DecesDetailsDTO,
    validationLogic: revalidateLogic({
      mode: "change",
    }),
    validators: {
      onChange: DecesDetailsSchema,
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
    totalSteps: 2, // Changé de 3 à 2
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

  // Récupération du prix dynamique
  const { data: servicesPrices, isLoading: servicesPricesLoading } =
    useServicesPricesQuery();

  // Création de la demande
  const {
    mutateAsync: createCertificatDeces,
    isPending: createCertificatDecesLoading,
  } = useCertificatDecesCreateMutation();

  const isLoading = servicesPricesLoading || createCertificatDecesLoading;

  const currentServicePrice = servicesPrices?.find(
    (service) => service.type === "DEATH_ACT_APPLICATION"
  );
  const prixActe = currentServicePrice?.defaultPrice;

  // Fonction pour valider les champs d'une étape spécifique
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof DecesDetailsDTO)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "deceasedFirstName",
          "deceasedLastName",
          "deceasedBirthDate",
          "deceasedDeathDate",
          "deceasedNationality",
        ];
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

  const onSubmit = async (data: DecesDetailsDTO) => {
    const uploadedFiles = files.map((file) => file.file as File);

    const dataForSubmit: DecesDetailsDTO = {
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
      await createCertificatDeces({ data: dataForSubmit });
      showSuccessAndRedirect();
    } catch (error) {}
  };

  const fieldsStep1: {
    name: keyof Omit<DecesDetailsDTO, "documents">;
    label: string;
    type?: string;
  }[] = [
    { name: "deceasedFirstName", label: "Prénom *", type: "text" },
    { name: "deceasedLastName", label: "Nom *", type: "text" },
    { name: "deceasedBirthDate", label: "Date de naissance *", type: "date" },
    { name: "deceasedDeathDate", label: "Date de décès *", type: "date" },
    { name: "deceasedNationality", label: "Nationalité *", type: "text" },
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

  const renderStep2 = () => (
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
    </FormContainer>
  );
}