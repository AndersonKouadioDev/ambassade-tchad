'use client';

import FileUploadView from "@/components/block/file-upload-view";
import { InputField } from "@/components/form/input-field";
import FormContainer from "@/components/form/multi-step/form-container";
import StepContainer from "@/components/form/multi-step/step-container";
import SelectInputField from "@/components/form/select-input-field";
import PriceViewer from "@/features/demande/components/price-viewer";
import { useActeNaissanceCreateMutation } from "@/features/demande/queries/birth-acte.mutation";
import { useServicesPricesQuery } from "@/features/demande/queries/demande-services.query";
import {
  ActeNaissanceDetailsDTO,
  ActeNaissanceDetailsSchema,
} from "@/features/demande/schema/acte-naissance.schema";
import { Genre } from "@/features/demande/types/demande.type";
import { handleFormSubmit } from "@/features/demande/utils/form-submit-handler";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useMultistepForm } from "@/hooks/use-multistep-form";
import { validateStepFields } from "@/lib/utils/multi-step-form/validate-step";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { ActeNaissanceType } from "../../types/acte-naissance.type";
import { useTranslations } from "next-intl";

function ActeNaissanceForm({ documentsSize }: { documentsSize: number }) {
  const t = useTranslations("ActeNaissanceForm");
  const tEnums = useTranslations("enums");

  const { Field, handleSubmit, validateField, getAllErrors } = useForm({
    defaultValues: {
      personFirstName: "John",
      personLastName: "Doe",
      personBirthDate: "1990-01-01",
      personBirthPlace: "Paris, France",
      personNationality: "French",
      personDomicile: "12 Peace Street, Paris",
      fatherFullName: "Pierre Doe",
      motherFullName: "Marie Doe",
      contactPhoneNumber: "+1 123 456 7890",
      requestType: ActeNaissanceType.NEWBORN,
    } as ActeNaissanceDetailsDTO,
    validationLogic: revalidateLogic({
      mode: "change",
    }),
    validators: {
      onChange: ActeNaissanceDetailsSchema,
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

  // Get dynamic price
  const { data: servicesPrices, isLoading: isLoadingServicesPrices } =
    useServicesPricesQuery();

  const isLoading = isLoadingServicesPrices;

  const currentServicePrice = servicesPrices?.find(
    (service) => service.type === "BIRTH_ACT_APPLICATION"
  );

  const prixActe = currentServicePrice?.defaultPrice;

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof ActeNaissanceDetailsDTO)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "personFirstName",
          "personLastName",
          "personBirthDate",
          "personBirthPlace",
          "personNationality",
          "personDomicile",
        ];
        break;
      case 2:
        fieldsToValidate = ["fatherFullName", "motherFullName"];
        break;
      case 3:
        fieldsToValidate = ["requestType"];
        break;
      case 4:
        fieldsToValidate = ["contactPhoneNumber"];
        break;
      default:
        return true; // No validation for subsequent steps
    }

    return validateStepFields(fieldsToValidate, validateField, getAllErrors);
  };

  const { mutateAsync: createActeNaissance } = useActeNaissanceCreateMutation();

  const onSubmit = async (data: ActeNaissanceDetailsDTO) => {
    const uploadedFiles = files.map((file) => file.file as File);

    await handleFormSubmit({
      data,
      files: uploadedFiles,
      requiredDocumentsCount: documentsSize,
      createMutation: createActeNaissance,
      onSuccess: showSuccessAndRedirect,
    });
  };

  const handleNext = () => {
    nextStep(validateStep);
  };

  type FieldStep = {
    name: keyof Omit<ActeNaissanceDetailsDTO, "documents">;
    label: string;
    type: string;
    options?: { value: string; label: string }[];
    placeholder?: string;
  };

  // Field definitions for each step
  const fieldsStep1: FieldStep[] = [
    {
      name: "personFirstName",
      label: t("fields.firstName"),
      type: "text",
      placeholder: t("placeholders.firstName"),
    },
    {
      name: "personLastName",
      label: t("fields.lastName"),
      type: "text",
      placeholder: t("placeholders.lastName"),
    },
    { 
      name: "personBirthDate", 
      label: t("fields.birthDate"), 
      type: "date" 
    },
    {
      name: "personBirthPlace",
      label: t("fields.birthPlace"),
      type: "text",
      placeholder: t("placeholders.birthPlace"),
    },
    {
      name: "personNationality",
      label: t("fields.nationality"),
      type: "text",
      placeholder: t("placeholders.nationality"),
    },
    {
      name: "personDomicile",
      label: t("fields.domicile"),
      type: "text",
      placeholder: t("placeholders.domicile"),
    },
  ];

  const fieldsStep2: FieldStep[] = [
    {
      name: "fatherFullName",
      label: t("fields.fatherFullName"),
      type: "text",
      placeholder: t("placeholders.fatherFullName"),
    },
    {
      name: "motherFullName",
      label: t("fields.motherFullName"),
      type: "text",
      placeholder: t("placeholders.motherFullName"),
    },
  ];

  const fieldsStep3: FieldStep[] = [
    {
      name: "contactPhoneNumber",
      label: t("fields.contactPhone"),
      type: "tel",
      placeholder: t("placeholders.contactPhone"),
    },
    {
      name: "requestType",
      label: t("fields.requestType"),
      type: "select",
      placeholder: t("placeholders.requestType"),
      options: Object.values(ActeNaissanceType).map((value) => ({
        value: value,
        label: tEnums(`acteNaissanceType.${value}`),
      })),
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
    <StepContainer title={t("steps.parentalInfo.title")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep2.map((item) => (
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

  const renderStep3 = () => (
    <StepContainer title={t("steps.agentInfo.title")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep3.map((item) => (
          <Field key={item.name} name={item.name}>
            {({ state, handleChange, handleBlur }) =>
              item.type === "select" ? (
                <SelectInputField
                  label={item.label}
                  value={state.value}
                  onChange={(value) => handleChange(value as string)}
                  onBlur={handleBlur}
                  errors={state.meta.errors![0]?.message}
                  options={item.options ?? []}
                  placeholder={item.placeholder}
                />
              ) : (
                <InputField
                  label={item.label}
                  placeholder={item.placeholder}
                  type={item.type}
                  value={state.value}
                  onChange={(value) => handleChange(value as string)}
                  onBlur={handleBlur}
                  errors={state.meta.errors![0]?.message}
                />
              )
            }
          </Field>
        ))}
        {documentsSize > 0 && (
          <div className="mb-4 col-span-full">
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
        )}
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
      {currentStep === 3 && renderStep3()}
    </FormContainer>
  );
}

export default ActeNaissanceForm;