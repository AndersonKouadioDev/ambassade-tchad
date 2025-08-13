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
import { DocumentJustificationType } from "@/features/demande/types/carte-consulaire.type";
import {
  ProcurationDetailsDTO,
  ProcurationDetailsSchema,
} from "@/features/demande/schema/procuration.schema";
import { useServicesPricesQuery } from "@/features/demande/queries/demande-services.query";
import { useProcurationCreateMutation } from "@/features/demande/queries/procuration.mutation";

interface Props {
  documentsSize: number;
}

export default function ProcurationForm({ documentsSize }: Props) {
  const { Field, handleSubmit, validateField, getAllErrors } = useForm({
    defaultValues: {
      agentFirstName: "John",
      agentLastName: "Doe",
      agentJustificationDocumentType:
        DocumentJustificationType.NATIONAL_ID_CARD,
      agentIdDocumentNumber: "123456789",
      agentAddress: "123 Main St, N'Djamena",
      principalFirstName: "John",
      principalLastName: "Doe",
      principalJustificationDocumentType:
        DocumentJustificationType.NATIONAL_ID_CARD,
      principalIdDocumentNumber: "123456789",
      principalAddress: "123 Main St, N'Djamena",
      powerOfType: "Procuration de pouvoir",
      reason: "pour effectuer des démarches administratives ",
      contactPhoneNumber: "123-456-7890",
      documents: [],
    } as ProcurationDetailsDTO,
    validationLogic: revalidateLogic({
      mode: "change",
    }),
    validators: {
      onChange: ProcurationDetailsSchema,
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
  const {
    mutateAsync: createProcuration,
    isPending: createProcurationLoading,
  } = useProcurationCreateMutation();

  const isLoading = servicesPricesLoading || createProcurationLoading;

  const currentServicePrice = servicesPrices?.find(
    (service) => service.type === "POWER_OF_ATTORNEY"
  );
  const prixActe = currentServicePrice?.defaultPrice;

  // Fonction pour valider les champs d'une étape spécifique
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof ProcurationDetailsDTO)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "principalFirstName",
          "principalLastName",
          "principalJustificationDocumentType",
          "principalIdDocumentNumber",
          "principalAddress",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "agentFirstName",
          "agentLastName",
          "agentJustificationDocumentType",
          "agentIdDocumentNumber",
          "agentAddress",
        ];
        break;
      case 3:
        fieldsToValidate = ["powerOfType", "reason", "contactPhoneNumber"];
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

  const onSubmit = async (data: ProcurationDetailsDTO) => {
    const uploadedFiles = files.map((file) => file.file as File);

    const dataForSubmit: ProcurationDetailsDTO = {
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
      await createProcuration({ data: dataForSubmit });
      showSuccessAndRedirect();
    } catch (error) {}
  };

  const fieldsStep1: {
    name: keyof Omit<ProcurationDetailsDTO, "documents">;
    label: string;
    type?: InputFieldTypeProps;
    options?: any;
    placeholder: string;
  }[] = [
    {
      name: "principalFirstName",
      label: "Prénom *",
      type: "text",
      placeholder: "Ex: Mahamat",
    },
    {
      name: "principalLastName",
      label: "Nom *",
      type: "text",
      placeholder: "Ex: Idriss",
    },
    {
      name: "principalJustificationDocumentType",
      label: "Type de pièce justificative *",
      type: "select",
      options: Object.values(DocumentJustificationType),
      placeholder: "",
    },
    {
      name: "principalIdDocumentNumber",
      label: "Numéro de pièce justificative *",
      type: "text",
      placeholder: "Ex: CNI123456",
    },
    {
      name: "principalAddress",
      label: "Adresse *",
      type: "text",
      placeholder: "Ex: 12 rue de N'Djamena",
    },
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Informations sur le mandant
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
                options={item.options}
              />
            )}
          </Field>
        ))}
      </div>
    </div>
  );

  const fieldsStep2: {
    name: keyof Omit<ProcurationDetailsDTO, "documents">;
    label: string;
    type?: InputFieldTypeProps;
    options?: { value: string; label: string }[];
    placeholder: string;
  }[] = [
    {
      name: "agentFirstName",
      label: "Prénom *",
      type: "text",
      placeholder: "Ex: Fatimé",
    },
    {
      name: "agentLastName",
      label: "Nom *",
      type: "text",
      placeholder: "Ex: Abakar",
    },
    {
      name: "agentJustificationDocumentType",
      label: "Type de pièce justificative *",
      type: "select",
      options: Object.values(DocumentJustificationType).map((value) => ({
        value,
        label: value,
      })),
      placeholder: "",
    },
    {
      name: "agentIdDocumentNumber",
      label: "Numéro de pièce justificative *",
      type: "text",
      placeholder: "Ex: CNI654321",
    },
    {
      name: "agentAddress",
      label: "Adresse *",
      type: "text",
      placeholder: "Ex: 34 avenue du Tchad",
    },
  ];

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Informations sur le mandataire
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
                options={item.options}
              />
            )}
          </Field>
        ))}
      </div>
    </div>
  );

  const fieldsStep3: {
    name: keyof Omit<ProcurationDetailsDTO, "documents">;
    label: string;
    type?: InputFieldTypeProps;
    options?: any;
    placeholder: string;
  }[] = [
    {
      name: "powerOfType",
      label: "Type de procuration",
      type: "text",
      placeholder: "Ex: Générale, Spéciale...",
    },
    {
      name: "reason",
      label: "Motif",
      type: "textarea",
      placeholder: "Ex: Délégation de signature",
    },
    {
      name: "contactPhoneNumber",
      label: "Numéro de contact *",
      type: "tel",
      placeholder: "Ex: +225 01 23 45 67 89",
    },
  ];
  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Détails de la procuration et contact
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep3.map((item) => (
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
                options={item.options}
              />
            )}
          </Field>
        ))}
      </div>
      <div className="mb-4 mt-6">
        <span className="text-lg font-semibold text-green-700">
          Prix à payer : {formatCurrency(prixActe ?? 10000)}
        </span>
      </div>
      <div className="md:col-span-2">
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
      title="Formulaire de demande de Procuration"
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
