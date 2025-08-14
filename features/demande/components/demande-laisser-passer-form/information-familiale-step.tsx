// components/form/laissez-passer/FamilyInfoStep.tsx
"use client";

import { InputField } from "@/components/form/input-field";
import { Field } from "@tanstack/react-form";
import { DocumentJustificationType } from "../../types/carte-consulaire.type";
import { SelectField } from "@/components/form/select-field";
import { LaissezPasserDetailsDTO } from "../../schema/laissez-passer.schema";

interface FamilyInfoStepProps {
  form: LaissezPasserDetailsDTO;
}

const documentOptions = Object.values(DocumentJustificationType).map((type) => ({
  value: type,
  label: type,
}));

export const FamilyInfoStep = ({ form }: FamilyInfoStepProps) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Informations familiales et documents
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Field < name="fatherFullName" form={form}>
        {({ state, handleChange, handleBlur }) => (
          <InputField
            label="Nom complet du père *"
            placeholder="Ex: John Doe"
            type="text"
            value={state.value as string ?? ''}
            onChange={(value) => handleChange(value)}
            onBlur={handleBlur}
            errors={state.meta.errors?.[0]?.message}
          />
        )}
      </Field>

      <Field name="motherFullName" form={form}>
        {({ state, handleChange, handleBlur }) => (
          <InputField
            label="Nom complet de la mère *"
            placeholder="Ex: Jane Doe"
            type="text"
            value={state.value ?? ''}
            onChange={(value) => handleChange(value)}
            onBlur={handleBlur}
            errors={state.meta.errors?.[0]?.message}
            required
          />
        )}
      </Field>

      <Field name="justificationDocumentType" form={form}>
        {({ state, handleChange, handleBlur }) => (
          <SelectField
            label="Type de document justificatif *"
            value={state.value}
            options={documentOptions}
            onChange={(value) => handleChange(value)}
            onBlur={handleBlur}
            errors={state.meta.errors?.[0]?.message}
            required
            className="col-span-full"
          />
        )}
      </Field>

      <Field name="justificationDocumentNumber" form={form}>
        {({ state, handleChange, handleBlur }) => (
          <InputField
            label="Numéro du document justificatif *"
            placeholder="Ex: 123456789"
            type="text"
            value={state.value ?? ''}
            onChange={(value) => handleChange(value)}
            onBlur={handleBlur}
            errors={state.meta.errors?.[0]?.message}
            required
          />
        )}
      </Field>

      <Field name="destination" form={form}>
        {({ state, handleChange, handleBlur }) => (
          <InputField
            label="Destination"
            placeholder="Ex: France"
            type="text"
            value={state.value ?? ''}
            onChange={(value) => handleChange(value)}
            onBlur={handleBlur}
            errors={state.meta.errors?.[0]?.message}
          />
        )}
      </Field>

      <Field name="travelReason" form={form}>
        {({ state, handleChange, handleBlur }) => (
          <InputField
            label="Motif du voyage"
            placeholder="Ex: Voyage d'affaires"
            type="text"
            value={state.value ?? ''}
            onChange={(value) => handleChange(value)}
            onBlur={handleBlur}
            errors={state.meta.errors?.[0]?.message}
          />
        )}
      </Field>
    </div>
  </div>
);