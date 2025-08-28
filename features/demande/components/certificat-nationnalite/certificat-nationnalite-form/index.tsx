"use client";

import FileUploadView from "@/components/block/file-upload-view";
import { InputField } from "@/components/form/input-field";
import FormContainer from "@/components/form/multi-step/form-container";
import StepContainer from "@/components/form/multi-step/step-container";
import SelectInputField from "@/components/form/select-input-field";
import PriceViewer from "@/features/demande/components/price-viewer";
import { handleFormSubmit } from "@/features/demande/utils/form-submit-handler";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useMultistepForm } from "@/hooks/use-multistep-form";
import { validateStepFields } from "@/lib/utils/multi-step-form/validate-step";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useCertificatNationaliteCreateMutation } from "../../../queries/certificat-nationalite.mutation";
import { useServicesPricesQuery } from "../../../queries/demande-services.query";
import {
  CertificatNationaliteDetailsDTO,
  CertificatNationaliteDetailsSchema,
} from "../../../schema/certificat-nationalite.schema";
import { PaysParentType } from "../../../types/certificat-nationalite.type";
import { getEnumOptions } from "@/features/demande/utils/get-enum-options";
import { useTranslations } from "next-intl";

interface Props {
  documentsSize: number;
}

export default function CertificatNationaliteForm({ documentsSize }: Props) {
  const t = useTranslations("enums");
  const tForm = useTranslations("CertificatNationaliteForm");

  // Validation du formulaire
  const { Field, handleSubmit, validateField, getAllErrors } = useForm({
    defaultValues: {
      applicantFirstName: "",
      applicantLastName: "",
      applicantBirthDate: "",
      applicantBirthPlace: "",
      applicantNationality: "",
      originCountryParentFirstName: "",
      originCountryParentLastName: "",
      originCountryParentRelationship: PaysParentType.FATHER,
      contactPhoneNumber: "",
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

  // Récupération du prix dynamique
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
    return validateStepFields(fieldsToValidate, validateField, getAllErrors);
  };

  const handleNext = () => {
    nextStep(validateStep);
  };

  const onSubmit = async (data: CertificatNationaliteDetailsDTO) => {
    const uploadedFiles = files.map((file) => file.file as File);

    await handleFormSubmit({
      data,
      files: uploadedFiles,
      requiredDocumentsCount: documentsSize,
      createMutation: createCertificatNationalite,
      onSuccess: showSuccessAndRedirect,
    });
  };

  const fieldsStep1: {
    name: keyof Omit<CertificatNationaliteDetailsDTO, "documents">;
    label: string;
    type?: string;
    placeholder?: string;
  }[] = [
    {
      name: "applicantFirstName",
      label: tForm("fields.firstName"),
      type: "text",
      placeholder: tForm("placeholders.firstName"),
    },
    {
      name: "applicantLastName",
      label: tForm("fields.lastName"),
      type: "text",
      placeholder: tForm("placeholders.lastName"),
    },
    {
      name: "applicantBirthDate",
      label: tForm("fields.birthDate"),
      type: "date",
    },
    {
      name: "applicantBirthPlace",
      label: tForm("fields.birthPlace"),
      type: "text",
      placeholder: tForm("placeholders.birthPlace"),
    },
    {
      name: "applicantNationality",
      label: tForm("fields.nationality"),
      type: "text",
      placeholder: tForm("placeholders.nationality"),
    },
  ];

  const renderStep1 = () => (
    <StepContainer title={tForm("steps.personalInfo.title")}>
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
    name: keyof Omit<CertificatNationaliteDetailsDTO, "documents">;
    label: string;
    type?: string;
    placeholder?: string;
  }[] = [
    {
      name: "originCountryParentFirstName",
      label: tForm("fields.parentFirstName"),
      type: "text",
      placeholder: tForm("placeholders.firstName"),
    },
    {
      name: "originCountryParentLastName",
      label: tForm("fields.parentLastName"),
      type: "text",
      placeholder: tForm("placeholders.lastName"),
    },
  ];

  const renderStep2 = () => (
    <StepContainer title={tForm("steps.parentInfo.title")}>
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

        <Field name="originCountryParentRelationship">
          {({ state, handleChange, handleBlur }) => (
            <SelectInputField
              label={tForm("fields.relationship")}
              placeholder={tForm("placeholders.relationship")}
              value={state.value}
              onChange={(value) => handleChange(value as PaysParentType)}
              onBlur={handleBlur}
              errors={state.meta.errors![0]?.message}
              options={getEnumOptions({
                enumData: PaysParentType,
                t,
                namespace: "paysParentType",
              })}
            />
          )}
        </Field>
      </div>
    </StepContainer>
  );

  const renderStep3 = () => (
    <StepContainer title={tForm("steps.summary.title")}>
      <div className="mb-4">
        <PriceViewer price={prixActe} />
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
              label={tForm("fields.contactPhone")}
              placeholder={tForm("placeholders.contactPhone")}
              type="text"
              value={state.value}
              onChange={(value) => handleChange(value as string)}
              onBlur={handleBlur}
              errors={state.meta.errors![0]?.message}
            />
          )}
        </Field>
      </div>
    </StepContainer>
  );

  if (showSuccess) {
    return successComponent(successCountdown);
  }

  return (
    <FormContainer
      title={tForm("title")}
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
