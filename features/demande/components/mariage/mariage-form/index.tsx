"use client";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import React from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/format-currency";
import { useFileUpload } from "@/hooks/use-file-upload";
import FileUploadView from "@/components/block/file-upload-view";
import { useMultistepForm } from "@/hooks/use-multistep-form";
import { InputField, InputFieldTypeProps } from "@/components/form/input-field";
import FormContainer from "@/components/form/multi-step/form-container";
import {
  MariageDetailsDTO,
  MariageDetailsSchema,
} from "@/features/demande/schema/mariage.schema";
import { useServicesPricesQuery } from "@/features/demande/queries/demande-services.query";
import { useMariageCreateMutation } from "@/features/demande/queries/mariage.mutation";

interface Props {
  documentsSize: number;
}

export default function MarriageCapacityActForm({ documentsSize }: Props) {
  // Validation du formulaire
  const { Field, handleSubmit, validateField, getAllErrors } = useForm({
    defaultValues: {
      husbandFirstName: "John",
      husbandLastName: "Doe",
      husbandBirthDate: "2000-01-01",
      husbandBirthPlace: "N'Djamena",
      husbandNationality: "Tchadienne",
      husbandDomicile: "123 Main St, N'Djamena",
      wifeFirstName: "Fatimé",
      wifeLastName: "Abakar",
      wifeBirthDate: "2000-01-01",
      wifeBirthPlace: "N'Djamena",
      wifeNationality: "Tchadienne",
      wifeDomicile: "123 Main St, N'Djamena",
      contactPhoneNumber: "123-456-7890",
      documents: [],
    } as MariageDetailsDTO,
    validationLogic: revalidateLogic({
      mode: "change",
    }),
    validators: {
      onChange: MariageDetailsSchema,
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
    { files, isDragging, errors: fileErrors },
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
  const { mutateAsync: createMariage, isPending: createMariageLoading } =
    useMariageCreateMutation(); // Assurez-vous d'avoir cette mutation

  const isLoading = servicesPricesLoading || createMariageLoading;

  const currentServicePrice = servicesPrices?.find(
    (service) => service.type === "MARRIAGE_CAPACITY_ACT"
  );
  const prixActe = currentServicePrice?.defaultPrice;

  // Fonction pour valider les champs d'une étape spécifique
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof MariageDetailsDTO)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "husbandFirstName",
          "husbandLastName",
          "husbandBirthDate",
          "husbandBirthPlace",
          "husbandNationality",
          "husbandDomicile",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "wifeFirstName",
          "wifeLastName",
          "wifeBirthDate",
          "wifeBirthPlace",
          "wifeNationality",
          "wifeDomicile",
        ];
        break;
      case 3:
        fieldsToValidate = ["contactPhoneNumber"];
        break;
      default:
        return true;
    }

    let isValid = true;
    for (const fieldName of fieldsToValidate) {
      try {
        await validateField(fieldName, "change");
      } catch (validationError: any) {
        isValid = false;
        toast.error(
          validationError?.message || `Erreur de validation pour ${fieldName}`
        );
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

  const onSubmit = async (data: MariageDetailsDTO) => {
    const uploadedFiles = files.map((file) => file.file as File);

    const dataForSubmit: MariageDetailsDTO = {
      ...data,
      documents: uploadedFiles,
    };
    // Validation finale avant soumission
    if (uploadedFiles.length < documentsSize) {
      toast.error(
        `Veuillez télécharger les ${documentsSize} documents requis.`
      );
      return;
    }

    try {
      await createMariage({ data: dataForSubmit });
      showSuccessAndRedirect();
    } catch (error) {
      // Gérer l'erreur ici
      toast.error("Une erreur est survenue lors de l'envoi du formulaire.");
    }
  };

  const fieldsStep1: {
    name: keyof Omit<MariageDetailsDTO, "documents">;
    label: string;
    type?: InputFieldTypeProps;
    placeholder: string;
  }[] = [
    {
      name: "husbandFirstName",
      label: "Prénom *",
      type: "text",
      placeholder: "Ex: Mahamat",
    },
    {
      name: "husbandLastName",
      label: "Nom *",
      type: "text",
      placeholder: "Ex: Idriss",
    },
    {
      name: "husbandBirthDate",
      label: "Date de naissance *",
      type: "date",
      placeholder: "",
    },
    {
      name: "husbandBirthPlace",
      label: "Lieu de naissance *",
      type: "text",
      placeholder: "Ex: N'Djamena",
    },
    {
      name: "husbandNationality",
      label: "Nationalité *",
      type: "text",
      placeholder: "Ex: Tchadienne",
    },
    {
      name: "husbandDomicile",
      label: "Domicile",
      type: "text",
      placeholder: "Ex: 12 rue de N'Djamena",
    },
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Informations sur l'époux
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep1.map((item) => (
          <Field key={item.name} name={item.name as any}>
            {({ state, handleChange, handleBlur }) => (
              <InputField
                label={item.label}
                placeholder={item.placeholder}
                type={item.type}
                value={state.value}
                onChange={(value) => handleChange(value as any)}
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
    name: keyof Omit<MariageDetailsDTO, "documents">;
    label: string;
    type?: InputFieldTypeProps;
    placeholder: string;
  }[] = [
    {
      name: "wifeFirstName",
      label: "Prénom *",
      type: "text",
      placeholder: "Ex: Fatimé",
    },
    {
      name: "wifeLastName",
      label: "Nom *",
      type: "text",
      placeholder: "Ex: Abakar",
    },
    {
      name: "wifeBirthDate",
      label: "Date de naissance *",
      type: "date",
      placeholder: "",
    },
    {
      name: "wifeBirthPlace",
      label: "Lieu de naissance *",
      type: "text",
      placeholder: "Ex: Sarh",
    },
    {
      name: "wifeNationality",
      label: "Nationalité *",
      type: "text",
      placeholder: "Ex: Tchadienne",
    },
    {
      name: "wifeDomicile",
      label: "Domicile",
      type: "text",
      placeholder: "Ex: 34 avenue du Tchad",
    },
  ];

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Informations sur l'épouse
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep2.map((item) => (
          <Field key={item.name} name={item.name as any}>
            {({ state, handleChange, handleBlur }) => (
              <InputField
                label={item.label}
                placeholder={item.placeholder}
                type={item.type}
                value={state.value}
                onChange={(value) => handleChange(value as any)}
                onBlur={handleBlur}
                errors={state.meta.errors![0]?.message}
              />
            )}
          </Field>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Contact, pièces justificatives et prix
      </h3>
      <div className="mb-4">
        <span className="text-lg font-semibold text-green-700">
          Prix à payer : {formatCurrency(prixActe ?? 10000)}
        </span>
      </div>
      <div className="mb-4">
        <Field name="contactPhoneNumber">
          {({ state, handleChange, handleBlur }) => (
            <InputField
              label="Numéro de contact *"
              placeholder="Ex: +225 01 23 45 67 89"
              type="tel"
              value={state.value}
              onChange={(value) => handleChange(value as any)}
              onBlur={handleBlur}
              errors={state.meta.errors![0]?.message}
            />
          )}
        </Field>
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
          errors={fileErrors}
          removeFile={removeFile}
          clearFiles={clearFiles}
          getInputProps={getInputProps}
        />
      </div>
    </div>
  );

  if (showSuccess) {
    return successComponent(successCountdown);
  }

  return (
    <FormContainer
      title="Formulaire de demande d'Acte de Capacité de Mariage"
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
