"use client";

import { InputField } from "@/components/form/input-field";
import { Field } from "@tanstack/react-form";
import FileUploadView from "@/components/block/file-upload-view";
import { formatCurrency } from "@/utils/format-currency";
import { useFileUpload } from "@/hooks/use-file-upload";

interface SummaryStepProps {
  prixActe?: number;
  fileUploadProps: ReturnType<typeof useFileUpload>[1] & {
    files: ReturnType<typeof useFileUpload>[0]['files'];
    isDragging: ReturnType<typeof useFileUpload>[0]['isDragging'];
    errors: ReturnType<typeof useFileUpload>[0]['errors'];
  };
}

export const SummaryStep = ({ prixActe, fileUploadProps }: SummaryStepProps) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Récapitulatif et pièces justificatives
    </h3>
    
    <div className="mb-4">
      <span className="text-lg font-semibold text-green-700">
        Prix à payer : {formatCurrency(prixActe ?? 5000)}
      </span>
    </div>

    <Field name="contactPhoneNumber">
      {({ state, handleChange, handleBlur }) => (
        <InputField
          label="Numéro de contact"
          placeholder="Ex: +225 01 23 45 67 89"
          type="tel"
          value={state.value ?? ''}
          onChange={(value) => handleChange(value)}
          onBlur={handleBlur}
          errors={state.meta.errors?.[0]?.message}
        />
      )}
    </Field>

    <div className="mb-4">
      <FileUploadView {...fileUploadProps} />
    </div>
  </div>
);