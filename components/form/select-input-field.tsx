import React from "react";
import { InputFieldProps } from "@/components/form/input-field";

interface SelectInputFieldProps extends Omit<InputFieldProps, "type"> {
  options: { value: string; label: string }[];
}

function SelectInputField({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  errors = undefined,
  options = [],
}: SelectInputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        aria-placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value || undefined)}
        onBlur={onBlur}
        className={`w-full px-4 py-2 border rounded-md ${
          errors ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="" disabled>
          {placeholder || "Sélectionnez une option"}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors && <p className="text-red-500 text-xs mt-1">{errors}</p>}
    </div>
  );
}

export default SelectInputField;
