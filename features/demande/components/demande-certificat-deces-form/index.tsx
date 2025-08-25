'use client';

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
import { useTranslations } from "next-intl";

interface Props {
  documentsSize: number;
}

export default function CertificatDecesForm({ documentsSize }: Props) {
  const t = useTranslations("CertificatDecesForm");
  const tErrors = useTranslations("errors");

  // Form validation
  const { Field, handleSubmit, validateField, getAllErrors } = useForm({
    defaultValues: {
      deceasedFirstName: "",
      deceasedLastName: "",
      deceasedBirthDate: "",
      deceasedDeathDate: "",
      deceasedNationality: "",
      contactPhoneNumber: "",
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
          validationError?.message || `${tErrors('validationError')} ${fieldName}`;
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
      label: t("fields.deceasedFirstName"),
      type: "text",
      placeholder: t("placeholders.firstName"),
    },
    {
      name: "deceasedLastName",
      label: t("fields.deceasedLastName"),
      type: "text",
      placeholder: t("placeholders.lastName"),
    },
    {
      name: "deceasedBirthDate",
      label: t("fields.deceasedBirthDate"),
      type: "date",
      placeholder: "",
    },
    {
      name: "deceasedDeathDate",
      label: t("fields.deceasedDeathDate"),
      type: "date",
      placeholder: "",
    },
    {
      name: "deceasedNationality",
      label: t("fields.deceasedNationality"),
      type: "text",
      placeholder: t("placeholders.nationality"),
    },
  ];

  const renderStep1 = () => (
    <StepContainer title={t("steps.personalInfo.title")}>
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
    <StepContainer title={t("steps.summary.title")}>
      <div className="mb-4">
        <PriceViewer price={prixActe ?? 5000} />
      </div>
      <div className="mb-4">
        <Field name="contactPhoneNumber">
          {({ state, handleChange, handleBlur }) => (
            <InputField
              label={t("fields.contactPhone")}
              placeholder={t("placeholders.contactPhone")}
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
      title={t("title")}
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