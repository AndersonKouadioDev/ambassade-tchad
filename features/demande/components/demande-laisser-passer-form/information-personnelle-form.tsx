"use client";

import { InputField } from "@/components/form/input-field";
import { Field } from "@tanstack/react-form";
import { LaissezPasserDetailsDTO } from "../../schema/laissez-passer.schema";

interface PersonalInfoStepProps {
  fields: {
    name: keyof Omit<LaissezPasserDetailsDTO, "documents">;
    label: string;
    type?: string;
  }[];
}

export const PersonalInfoStep = ({ fields }: PersonalInfoStepProps) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Informations personnelles
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map((item) => (
        <Field key={item.name} name={item.name}>
          {({ state, handleChange, handleBlur }) => (
            <InputField
              label={item.label}
              placeholder={`Ex: ${item.name.includes("FirstName") ? "Mahamat" : "Doe"}`}
              type={item.type}
              value={state.value ?? ''}
              onChange={(value) => handleChange(value)}
              onBlur={handleBlur}
              errors={state.meta.errors?.[0]?.message}
              required={item.label.includes("*")}
            />
          )}
        </Field>
      ))}
    </div>
  </div>
);