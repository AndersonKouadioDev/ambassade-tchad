"use client";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { useFileUpload } from "@/hooks/use-file-upload";
import FileUploadView from "@/components/block/file-upload-view";
import { useMultistepForm } from "@/hooks/use-multistep-form";
import { InputField } from "@/components/form/input-field";
import FormContainer from "@/components/form/multi-step/form-container";
import {
  Genre,
  SituationMatrimoniale,
} from "@/features/demande/types/demande.type";
import { PassportType, VisaType } from "@/features/demande/types/visa.type";
import {
  VisaRequestDetailsDTO,
  VisaRequestDetailsSchema,
} from "@/features/demande/schema/visa.schema";
import { useServicesPricesQuery } from "@/features/demande/queries/demande-services.query";
import { useVisaCreateMutation } from "@/features/demande/queries/visa.mutation";
import StepContainer from "@/components/form/multi-step/step-container";
import SelectInputField from "@/components/form/select-input-field";
import PriceViewer from "../../price-viewer";

interface Props {
  documentsSize: number;
}

export default function VisaForm({ documentsSize }: Props) {
  const t = useTranslations("visaForm");
  
  // Validation du formulaire
  const {
    Field,
    handleSubmit,
    validateField,
    getAllErrors,
    getFieldValue,
    setFieldValue,
  } = useForm({
    defaultValues: {
      personFirstName: "",
      personLastName: "",
      personGender: Genre.MALE,
      personNationality: "",
      personBirthDate: "",
      personBirthPlace: "",
      personMaritalStatus: SituationMatrimoniale.SINGLE,
      passportType: PassportType.ORDINARY,
      passportNumber: "",
      passportIssuedBy: "",
      passportIssueDate: "",
      passportExpirationDate: "",
      profession: "",
      employerAddress: "",
      employerPhoneNumber: "",
      durationMonths: 1,
      destinationState: "",
      visaType: VisaType.SHORT_STAY,
      contactPhoneNumber: "",
      documents: [],
    } as VisaRequestDetailsDTO,
    validationLogic: revalidateLogic({
      mode: "change",
    }),
    validators: {
      onChange: VisaRequestDetailsSchema,
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
    totalSteps: 4,
    redirectPath: "/espace-client/mes-demandes?success=true",
    successCountdownDuration: 5,
  });

  const durationMonths = getFieldValue("durationMonths");

  useEffect(() => {
    if (typeof durationMonths === 'number') {
      if (durationMonths <= 3) {
        setFieldValue("visaType", VisaType.SHORT_STAY);
      } else {
        setFieldValue("visaType", VisaType.LONG_STAY);
      }
    }
  }, [durationMonths, setFieldValue]);

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
  const { mutateAsync: createVisa, isPending: createVisaLoading } =
    useVisaCreateMutation();

  const isLoading = servicesPricesLoading || createVisaLoading;

  const currentServicePrice = servicesPrices?.find(
    (service) => service.type === "VISA"
  );
  const prixActe = currentServicePrice?.defaultPrice;

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof VisaRequestDetailsDTO)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "personFirstName",
          "personLastName",
          "personGender",
          "personNationality",
          "personBirthDate",
          "personBirthPlace",
          "personMaritalStatus",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "passportType",
          "passportNumber",
          "passportIssuedBy",
          "passportIssueDate",
          "passportExpirationDate",
        ];
        break;
      case 3:
        fieldsToValidate = [
          "profession",
          "employerAddress",
          "employerPhoneNumber",
          "durationMonths",
          "destinationState",
        ];
        break;
      case 4:
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
          validationError?.message || t("validationError", { field: fieldName })
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

  const onSubmit = async (data: VisaRequestDetailsDTO) => {
    const uploadedFiles = files.map((file) => file.file as File);

    const visaType =
      data.durationMonths <= 3 ? VisaType.SHORT_STAY : VisaType.LONG_STAY;

    const dataForSubmit: VisaRequestDetailsDTO = {
      ...data,
      visaType: visaType,
      documents: uploadedFiles,
    };

    if (uploadedFiles.length < documentsSize) {
      toast.error(
        t("documentsRequired", { count: documentsSize })
      );
      return;
    }
    try {
      await createVisa({ data: dataForSubmit });
      showSuccessAndRedirect();
    } catch (error) {
      toast.error(t("submitError"));
    }
  };

  // Fonctions de traduction pour les options des sélecteurs
  const translateGenre = (genre: Genre) => {
    const translations: Record<Genre, string> = {
      [Genre.MALE]: t("gender.male"),
      [Genre.FEMALE]: t("gender.female")
    };
    return translations[genre] || genre;
  };

  const translateMaritalStatus = (status: SituationMatrimoniale) => {
    const translations: Record<SituationMatrimoniale, string> = {
      [SituationMatrimoniale.SINGLE]: t("maritalStatus.single"),
      [SituationMatrimoniale.MARRIED]: t("maritalStatus.married"),
      [SituationMatrimoniale.DIVORCED]: t("maritalStatus.divorced"),
      [SituationMatrimoniale.WIDOWED]: t("maritalStatus.widowed")
    };
    return translations[status] || status;
  };

  const translatePassportType = (type: PassportType) => {
    const translations: Record<PassportType, string> = {
      [PassportType.ORDINARY]: t("passportType.ordinary"),
      [PassportType.DIPLOMATIC]: t("passportType.diplomatic"),
      [PassportType.SERVICE]: t("passportType.service")
    };
    return translations[type] || type;
  };

  const fieldsStep1: {
    name: keyof Omit<VisaRequestDetailsDTO, "documents">;
    label: string;
    type?: string;
    options?: { value: string; label: string }[];
    placeholder: string;
  }[] = [
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
      name: "personGender",
      label: t("fields.gender"),
      type: "select",
      options: Object.values(Genre).map((genre) => ({
        value: genre,
        label: translateGenre(genre),
      })),
      placeholder: "",
    },
    {
      name: "personNationality",
      label: t("fields.nationality"),
      type: "text",
      placeholder: t("placeholders.nationality"),
    },
    {
      name: "personBirthDate",
      label: t("fields.birthDate"),
      type: "date",
      placeholder: "",
    },
    {
      name: "personBirthPlace",
      label: t("fields.birthPlace"),
      type: "text",
      placeholder: t("placeholders.birthPlace"),
    },
    {
      name: "personMaritalStatus",
      label: t("fields.maritalStatus"),
      type: "select",
      options: Object.values(SituationMatrimoniale).map((status) => ({
        value: status,
        label: translateMaritalStatus(status),
      })),
      placeholder: "",
    },
  ];

  const renderStep1 = () => (
    <StepContainer title={t("steps.personalInfo")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep1.map((item) => (
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

  const fieldsStep2: {
    name: keyof Omit<VisaRequestDetailsDTO, "documents">;
    label: string;
    type?: string;
    options?: { value: string; label: string }[];
    placeholder: string;
  }[] = [
    {
      name: "passportType",
      label: t("fields.passportType"),
      type: "select",
      options: Object.values(PassportType).map((type) => ({
        value: type,
        label: translatePassportType(type),
      })),
      placeholder: "",
    },
    {
      name: "passportNumber",
      label: t("fields.passportNumber"),
      type: "text",
      placeholder: t("placeholders.passportNumber"),
    },
    {
      name: "passportIssuedBy",
      label: t("fields.passportIssuedBy"),
      type: "text",
      placeholder: t("placeholders.passportIssuedBy"),
    },
    {
      name: "passportIssueDate",
      label: t("fields.passportIssueDate"),
      type: "date",
      placeholder: "",
    },
    {
      name: "passportExpirationDate",
      label: t("fields.passportExpirationDate"),
      type: "date",
      placeholder: "",
    },
  ];

  const renderStep2 = () => (
    <StepContainer title={t("steps.passportInfo")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep2.map((item) => (
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

  const fieldsStep3: {
    name: keyof Omit<VisaRequestDetailsDTO, "documents">;
    label: string;
    type?: string;
    dataType?: "string" | "number";
    placeholder: string;
  }[] = [
    {
      name: "profession",
      label: t("fields.profession"),
      type: "text",
      dataType: "string",
      placeholder: t("placeholders.profession"),
    },
    {
      name: "employerAddress",
      label: t("fields.employerAddress"),
      type: "text",
      dataType: "string",
      placeholder: t("placeholders.employerAddress"),
    },
    {
      name: "employerPhoneNumber",
      label: t("fields.employerPhoneNumber"),
      type: "text",
      dataType: "string",
      placeholder: t("placeholders.employerPhoneNumber"),
    },
    {
      name: "durationMonths",
      label: t("fields.durationMonths"),
      type: "number",
      dataType: "number",
      placeholder: t("placeholders.durationMonths"),
    },
    {
      name: "destinationState",
      label: t("fields.destinationState"),
      type: "text",
      dataType: "string",
      placeholder: t("placeholders.destinationState"),
    },
  ];

  const renderStep3 = () => (
    <StepContainer title={t("steps.professionalInfo")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep3.map((item) => (
          <Field key={item.name} name={item.name}>
            {({ state, handleChange, handleBlur }) => (
              <InputField
                label={item.label}
                placeholder={item.placeholder}
                type={item.type}
                value={state.value}
                onChange={(value) => {
                  // Conversion spécifique pour les champs numériques
                  if (item.dataType === "number") {
                    handleChange(Number(value));
                  } else {
                    handleChange(value as string);
                  }
                }}
                onBlur={handleBlur}
                errors={state.meta.errors![0]?.message}
              />
            )}
          </Field>
        ))}
      </div>
    </StepContainer>
  );

  const renderStep4 = () => (
    <StepContainer title={t("steps.documents")}>
      <div className="mb-4">
        <PriceViewer price={prixActe ?? 5000} />
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
      <div className="mb-4">
        <Field name="contactPhoneNumber">
          {({ state, handleChange, handleBlur }) => (
            <InputField
              label={t("fields.contactPhoneNumber")}
              placeholder={t("placeholders.contactPhoneNumber")}
              type="text"
              value={state.value}
              onChange={(value) => handleChange(value as any)}
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
      {currentStep === 4 && renderStep4()}
    </FormContainer>
  );
}