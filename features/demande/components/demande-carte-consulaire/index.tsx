'use client';

import React from "react";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import {
  CarteConsulaireDetailsDTO,
  CarteConsulaireDetailsSchema,
} from "@/features/demande/schema/carte-consulaire.schema";
import { useMultistepForm } from "@/hooks/use-multistep-form";
import { DocumentJustificationType } from "@/features/demande/types/carte-consulaire.type";
import { useServicesPricesQuery } from "@/features/demande/queries/demande-services.query";
import { validateStepFields } from "@/lib/utils/multi-step-form/validate-step";
import { handleFormSubmit } from "@/features/demande/utils/form-submit-handler";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useCarteConsulaireCreateMutation } from "@/features/demande/queries/carte-consulaire.mutation";
import StepContainer from "@/components/form/multi-step/step-container";
import { InputField } from "@/components/form/input-field";
import FormContainer from "@/components/form/multi-step/form-container";
import PriceViewer from "@/features/demande/components/price-viewer";
import FileUploadView from "@/components/block/file-upload-view";
import SelectInputField from "@/components/form/select-input-field";
import { useTranslations } from "next-intl";

function CarteConsulaireForm({ documentsSize }: { documentsSize: number }) {
  const t = useTranslations("CarteConsulaireForm");
  const tEnums = useTranslations("enums");

  const {
    Field,
    handleSubmit,
    validateField,
    getAllErrors,
  } = useForm({
    defaultValues: {
      personFirstName: "",
      personLastName: "",
      personBirthDate: "",
      personBirthPlace: "",
      personProfession: "",
      personNationality: "",
      personDomicile: "",
      personAddressInOriginCountry: "",
      fatherFullName: "",
      motherFullName: "",
      justificationDocumentType: DocumentJustificationType.NATIONAL_ID_CARD,
      justificationDocumentNumber: "",
      contactPhoneNumber: "",
    } as CarteConsulaireDetailsDTO,
    validationLogic: revalidateLogic({
      mode: "change",
    }),
    validators: {
      onChange: CarteConsulaireDetailsSchema,
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

  // File upload configuration
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
    (service) => service.type === "CONSULAR_CARD"
  );

  const prixActe = currentServicePrice?.defaultPrice;

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof CarteConsulaireDetailsDTO)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "personFirstName",
          "personLastName",
          "personBirthDate",
          "personBirthPlace",
          "personNationality",
          "personProfession",
          "personDomicile",
          "personAddressInOriginCountry",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "fatherFullName",
          "motherFullName",
          "justificationDocumentType",
          "justificationDocumentNumber",
        ];
        break;
      case 3:
        fieldsToValidate = ["contactPhoneNumber"];
        break;
      default:
        return true; // No validation for subsequent steps
    }

    return validateStepFields(fieldsToValidate, validateField, getAllErrors);
  };

  const { mutateAsync: createCarteConsulaire } =
    useCarteConsulaireCreateMutation();

  const onSubmit = async (data: CarteConsulaireDetailsDTO) => {
    const uploadedFiles = files.map((file) => file.file as File);

    await handleFormSubmit({
      data,
      files: uploadedFiles,
      requiredDocumentsCount: documentsSize,
      createMutation: createCarteConsulaire,
      onSuccess: showSuccessAndRedirect,
    });
  };

  const handleNext = () => {
    nextStep(validateStep);
  };

  type FieldStep = {
    name: keyof Omit<CarteConsulaireDetailsDTO, "documents">;
    label: string;
    type: string;
    placeholder?: string;
    options?: { value: string; label: string }[];
  };

  const fields: FieldStep[][] = [
    [
      { name: "personFirstName", label: t("fields.firstName"), type: "text" },
      { name: "personLastName", label: t("fields.lastName"), type: "text" },
      { name: "personBirthDate", label: t("fields.birthDate"), type: "date" },
      { name: "personBirthPlace", label: t("fields.birthPlace"), type: "text" },
      { name: "personProfession", label: t("fields.profession"), type: "text" },
      { name: "personNationality", label: t("fields.nationality"), type: "text" },
      { name: "personDomicile", label: t("fields.domicile"), type: "text" },
      {
        name: "personAddressInOriginCountry",
        label: t("fields.originCountryAddress"),
        type: "text",
      },
    ],
    [
      { name: "fatherFullName", label: t("fields.fatherFullName"), type: "text" },
      { name: "motherFullName", label: t("fields.motherFullName"), type: "text" },
      {
        name: "justificationDocumentType",
        label: t("fields.justificationDocumentType"),
        type: "select",
        placeholder: t("placeholders.selectDocumentType"),
        options: [
          {
            value: DocumentJustificationType.NATIONAL_ID_CARD,
            label: tEnums("documentJustificationType.NATIONAL_ID_CARD"),
          },
          { 
            value: DocumentJustificationType.PASSPORT, 
            label: tEnums("documentJustificationType.PASSPORT") 
          },
          {
            value: DocumentJustificationType.BIRTH_CERTIFICATE,
            label: tEnums("documentJustificationType.BIRTH_CERTIFICATE"),
          },
          { 
            value: DocumentJustificationType.OTHER, 
            label: tEnums("documentJustificationType.OTHER") 
          },
        ],
      },
      {
        name: "justificationDocumentNumber",
        label: t("fields.justificationDocumentNumber"),
        type: "text",
        placeholder: t("placeholders.documentNumber"),
      },
    ],
    [
      {
        name: "contactPhoneNumber",
        label: t("fields.contactPhone"),
        type: "tel",
        placeholder: t("placeholders.contactPhone"),
      },
    ],
  ];

  const renderStep1 = () => (
    <StepContainer title={t("steps.personalInfo.title")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields[0].map((item) => (
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
    <StepContainer title={t("steps.filiationInfo.title")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields[1].map((item) => (
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
      </div>
    </StepContainer>
  );

  const renderStep3 = () => (
    <StepContainer title={t("steps.summary.title")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <PriceViewer price={prixActe} />
        </div>
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
        {fields[2].map((item) => (
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

export default CarteConsulaireForm;