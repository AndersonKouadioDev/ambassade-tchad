"use client";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import FileUploadView from "@/components/block/file-upload-view";
import { InputField } from "@/components/form/input-field";
import FormContainer from "@/components/form/multi-step/form-container";
import StepContainer from "@/components/form/multi-step/step-container";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useMultistepForm } from "@/hooks/use-multistep-form";
import { useCertificatDecesCreateMutation } from "../../queries/certificat-deces.mutation";
import { useServicesPricesQuery } from "../../queries/demande-services.query";
import { DecesDetailsDTO, DecesDetailsSchema } from "../../schema/deces.schema";
import { ServiceType } from "../../types/service.type";
import PriceViewer from "../price-viewer";
import { handleFormSubmit } from "../../utils/form-submit-handler";

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
    totalSteps: 2,
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

  const { data: servicesPrices, isLoading: servicesPricesLoading } =
    useServicesPricesQuery();

  const {
    mutateAsync: createCertificatDeces,
    isPending: createCertificatDecesLoading,
  } = useCertificatDecesCreateMutation();

  const isLoading = servicesPricesLoading || createCertificatDecesLoading;

  const currentServicePrice = servicesPrices?.find(
    (service) => service.type === ServiceType.DEATH_ACT_APPLICATION
  );
  const prixActe = currentServicePrice?.defaultPrice;

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
      case 2:
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

    await handleFormSubmit({
      data,
      files: uploadedFiles,
      requiredDocumentsCount: documentsSize,
      createMutation: createCertificatDeces,
      onSuccess: showSuccessAndRedirect,
    });
  };

  const fieldsStep1: {
    name: keyof Omit<DecesDetailsDTO, "documents">;
    label: string;
    type?: string;
    placeholder: string;
  }[] = [
    {
      name: "deceasedFirstName",
      label: "Prénom *",
      type: "text",
      placeholder: "Ex: Mahamat",
    },
    {
      name: "deceasedLastName",
      label: "Nom *",
      type: "text",
      placeholder: "Ex: Idriss",
    },
    {
      name: "deceasedBirthDate",
      label: "Date de naissance *",
      type: "date",
      placeholder: "",
    },
    {
      name: "deceasedDeathDate",
      label: "Date de décès *",
      type: "date",
      placeholder: "",
    },
    {
      name: "deceasedNationality",
      label: "Nationalité *",
      type: "text",
      placeholder: "Ex: Tchadienne",
    },
  ];

  const renderStep1 = () => (
    <StepContainer title="Informations personnelles">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep1.map((item) => (
          <Field key={item.name} name={item.name}>
            {({ state, handleChange, handleBlur }) => (
              <InputField
                label={item.label}
                placeholder={item.placeholder}
                type={item.type}
                value={state.value}
                onChange={(value) => handleChange(value as string)}
                onBlur={handleBlur}
                errors={state.meta.errors![0]?.message}
              />
            )}
          </Field>
        ))}
      </div>
    </StepContainer>
  );

  const renderStep2 = () => (
    <StepContainer title="Récapitulatif et pièces justificatives">
      <div className="mb-4">
        <PriceViewer price={prixActe ?? 5000} />
      </div>
      <div className="mb-4">
        <Field name="contactPhoneNumber">
          {({ state, handleChange, handleBlur }) => (
            <InputField
              label="Numéro de contact *"
              placeholder="Ex: +225 01 23 45 67 89"
              type="tel"
              value={state.value}
              onChange={(value) => handleChange(value as string)}
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
    </StepContainer>
  );

  if (showSuccess) {
    return successComponent(successCountdown);
  }

  return (
    <FormContainer
      title="Formulaire de demande de Certificat de Décès"
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
