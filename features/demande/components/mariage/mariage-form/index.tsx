'use client';

import { revalidateLogic, useForm } from "@tanstack/react-form";
import React from "react";
import { toast } from "sonner";

import { useFileUpload } from "@/hooks/use-file-upload";
import FileUploadView from "@/components/block/file-upload-view";
import { useMultistepForm } from "@/hooks/use-multistep-form";
import { InputField } from "@/components/form/input-field";
import FormContainer from "@/components/form/multi-step/form-container";
import {
  MariageDetailsDTO,
  MariageDetailsSchema,
} from "@/features/demande/schema/mariage.schema";
import { useServicesPricesQuery } from "@/features/demande/queries/demande-services.query";
import { useMariageCreateMutation } from "@/features/demande/queries/mariage.mutation";
import StepContainer from "@/components/form/multi-step/step-container";
import PriceViewer from "../../price-viewer";
import { useTranslations } from "next-intl";

interface Props {
  documentsSize: number;
}

export default function MarriageCapacityActForm({ documentsSize }: Props) {
  const t = useTranslations("MarriageCapacityActForm");
  const tErrors = useTranslations("errors");

  // Form validation
  const { Field, handleSubmit, validateField, getAllErrors } = useForm({
    defaultValues: {
      husbandFirstName: "",
      husbandLastName: "",
      husbandBirthDate: "",
      husbandBirthPlace: "",
      husbandNationality: "",
      husbandDomicile: "",
      wifeFirstName: "",
      wifeLastName: "",
      wifeBirthDate: "",
      wifeBirthPlace: "",
      wifeNationality: "",
      wifeDomicile: "",
      contactPhoneNumber: "",
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

  const { data: servicesPrices, isLoading: servicesPricesLoading } =
    useServicesPricesQuery();

  const { mutateAsync: createMariage, isPending: createMariageLoading } =
    useMariageCreateMutation();

  const isLoading = servicesPricesLoading || createMariageLoading;

  const currentServicePrice = servicesPrices?.find(
    (service) => service.type === "MARRIAGE_CAPACITY_ACT"
  );
  const prixActe = currentServicePrice?.defaultPrice;

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
          validationError?.message || `${tErrors('validationError')} ${fieldName}`
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

    if (uploadedFiles.length < documentsSize) {
      toast.error(
        `${tErrors('documentsRequired')} (${documentsSize})`
      );
      return;
    }

    try {
      await createMariage({ data: dataForSubmit });
      showSuccessAndRedirect();
    } catch (error) {
      toast.error(tErrors('submitError'));
    }
  };

  const fieldsStep1: {
    name: keyof Omit<MariageDetailsDTO, "documents">;
    label: string;
    type?: string;
    placeholder: string;
  }[] = [
    {
      name: "husbandFirstName",
      label: t("fields.husbandFirstName"),
      type: "text",
      placeholder: t("placeholders.firstName"),
    },
    {
      name: "husbandLastName",
      label: t("fields.husbandLastName"),
      type: "text",
      placeholder: t("placeholders.lastName"),
    },
    {
      name: "husbandBirthDate",
      label: t("fields.husbandBirthDate"),
      type: "date",
      placeholder: "",
    },
    {
      name: "husbandBirthPlace",
      label: t("fields.husbandBirthPlace"),
      type: "text",
      placeholder: t("placeholders.birthPlace"),
    },
    {
      name: "husbandNationality",
      label: t("fields.husbandNationality"),
      type: "text",
      placeholder: t("placeholders.nationality"),
    },
    {
      name: "husbandDomicile",
      label: t("fields.husbandDomicile"),
      type: "text",
      placeholder: t("placeholders.domicile"),
    },
  ];

  const renderStep1 = () => (
    <StepContainer title={t("steps.husbandInfo.title")}>
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

  const fieldsStep2: {
    name: keyof Omit<MariageDetailsDTO, "documents">;
    label: string;
    type?: string;
    placeholder: string;
  }[] = [
    {
      name: "wifeFirstName",
      label: t("fields.wifeFirstName"),
      type: "text",
      placeholder: t("placeholders.firstName"),
    },
    {
      name: "wifeLastName",
      label: t("fields.wifeLastName"),
      type: "text",
      placeholder: t("placeholders.lastName"),
    },
    {
      name: "wifeBirthDate",
      label: t("fields.wifeBirthDate"),
      type: "date",
      placeholder: "",
    },
    {
      name: "wifeBirthPlace",
      label: t("fields.wifeBirthPlace"),
      type: "text",
      placeholder: t("placeholders.birthPlace"),
    },
    {
      name: "wifeNationality",
      label: t("fields.wifeNationality"),
      type: "text",
      placeholder: t("placeholders.nationality"),
    },
    {
      name: "wifeDomicile",
      label: t("fields.wifeDomicile"),
      type: "text",
      placeholder: t("placeholders.domicile"),
    },
  ];

  const renderStep2 = () => (
    <StepContainer title={t("steps.wifeInfo.title")}>
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
    <StepContainer title={t("steps.summary.title")}>
      <div className="mb-4">
        <PriceViewer price={prixActe ?? 10000} />
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
      {documentsSize > 0 && (
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
      )}
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