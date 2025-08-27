'use client';

import { revalidateLogic, useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import FileUploadView from "@/components/block/file-upload-view";
import { InputField } from "@/components/form/input-field";
import FormContainer from "@/components/form/multi-step/form-container";
import StepContainer from "@/components/form/multi-step/step-container";
import SelectInputField from "@/components/form/select-input-field";
import { useServicesPricesQuery } from "@/features/demande/queries/demande-services.query";
import { useProcurationCreateMutation } from "@/features/demande/queries/procuration.mutation";
import {
  ProcurationDetailsDTO,
  ProcurationDetailsSchema,
} from "@/features/demande/schema/procuration.schema";
import { DocumentJustificationType } from "@/features/demande/types/carte-consulaire.type";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useMultistepForm } from "@/hooks/use-multistep-form";
import PriceViewer from "../../price-viewer";
import { useTranslations } from "next-intl";

interface Props {
  documentsSize: number;
}

export default function ProcurationForm({ documentsSize }: Props) {
  const t = useTranslations("ProcurationForm");
  const tEnums = useTranslations("enums");
  const tErrors = useTranslations("errors");

  const { Field, handleSubmit, validateField, getAllErrors } = useForm({
    defaultValues: {
      agentFirstName: "",
      agentLastName: "",
      agentJustificationDocumentType:
        DocumentJustificationType.NATIONAL_ID_CARD,
      agentIdDocumentNumber: "",
      agentAddress: "",
      principalFirstName: "",
      principalLastName: "",
      principalJustificationDocumentType:
        DocumentJustificationType.NATIONAL_ID_CARD,
      principalIdDocumentNumber: "",
      principalAddress: "",
      powerOfType: "",
      reason: "",
      contactPhoneNumber: "",
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

  const { data: servicesPrices, isLoading: servicesPricesLoading } =
    useServicesPricesQuery();

  const {
    mutateAsync: createProcuration,
    isPending: createProcurationLoading,
  } = useProcurationCreateMutation();

  const isLoading = servicesPricesLoading || createProcurationLoading;

  const currentServicePrice = servicesPrices?.find(
    (service) => service.type === "POWER_OF_ATTORNEY"
  );
  const prixActe = currentServicePrice?.defaultPrice;

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

  const onSubmit = async (data: ProcurationDetailsDTO) => {
    const uploadedFiles = files.map((file) => file.file as File);

    const dataForSubmit: ProcurationDetailsDTO = {
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
      await createProcuration({ data: dataForSubmit });
      showSuccessAndRedirect();
    } catch (error) {
      toast.error(tErrors('submitError'));
    }
  };

  const fieldsStep1: {
    name: keyof Omit<ProcurationDetailsDTO, "documents">;
    label: string;
    type?: string;
    options?: { value: string; label: string }[];
    placeholder?: string;
  }[] = [
    {
      name: "principalFirstName",
      label: t("fields.principalFirstName"),
      type: "text",
      placeholder: t("placeholders.firstName"),
    },
    {
      name: "principalLastName",
      label: t("fields.principalLastName"),
      type: "text",
      placeholder: t("placeholders.lastName"),
    },
    {
      name: "principalJustificationDocumentType",
      label: t("fields.principalJustificationDocumentType"),
      type: "select",
      options: Object.values(DocumentJustificationType).map((value) => ({
        value,
        label: tEnums(`documentJustificationType.${value}`),
      })),
      placeholder: "",
    },
    {
      name: "principalIdDocumentNumber",
      label: t("fields.principalIdDocumentNumber"),
      type: "text",
      placeholder: t("placeholders.documentNumber"),
    },
    {
      name: "principalAddress",
      label: t("fields.principalAddress"),
      type: "text",
      placeholder: t("placeholders.address"),
    },
  ];

  const renderStep1 = () => (
    <StepContainer title={t("steps.principalInfo.title")}>
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
    name: keyof Omit<ProcurationDetailsDTO, "documents">;
    label: string;
    type?: string;
    options?: { value: string; label: string }[];
    placeholder?: string;
  }[] = [
    {
      name: "agentFirstName",
      label: t("fields.agentFirstName"),
      type: "text",
      placeholder: t("placeholders.firstName"),
    },
    {
      name: "agentLastName",
      label: t("fields.agentLastName"),
      type: "text",
      placeholder: t("placeholders.lastName"),
    },
    {
      name: "agentJustificationDocumentType",
      label: t("fields.agentJustificationDocumentType"),
      type: "select",
      options: Object.values(DocumentJustificationType).map((value) => ({
        value,
        label: tEnums(`documentJustificationType.${value}`),
      })),
      placeholder: "",
    },
    {
      name: "agentIdDocumentNumber",
      label: t("fields.agentIdDocumentNumber"),
      type: "text",
      placeholder: t("placeholders.documentNumber"),
    },
    {
      name: "agentAddress",
      label: t("fields.agentAddress"),
      type: "text",
      placeholder: t("placeholders.address"),
    },
  ];

  const renderStep2 = () => (
    <StepContainer title={t("steps.agentInfo.title")}>
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
    name: keyof Omit<ProcurationDetailsDTO, "documents">;
    label: string;
    type?: string;
    placeholder: string;
  }[] = [
    {
      name: "powerOfType",
      label: t("fields.powerOfType"),
      type: "text",
      placeholder: t("placeholders.powerOfType"),
    },
    {
      name: "reason",
      label: t("fields.reason"),
      type: "textarea",
      placeholder: t("placeholders.reason"),
    },
    {
      name: "contactPhoneNumber",
      label: t("fields.contactPhone"),
      type: "tel",
      placeholder: t("placeholders.contactPhone"),
    },
  ];

  const renderStep3 = () => (
    <StepContainer title={t("steps.details.title")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep3.map((item) => (
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
      <hr className="my-6" />
      <div className="mb-4">
        <PriceViewer price={prixActe ?? 10000} />
      </div>
      {documentsSize > 0 && (
        <div className="mb-4 md:col-span-2">
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