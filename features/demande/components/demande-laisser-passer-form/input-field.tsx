// components/form/input-field.tsx
"use client";

import React from 'react';

interface InputFieldProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  errors?: string;
  required?: boolean;
  className?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, value = '', onChange, onBlur, placeholder, type = 'text', errors, required = false, className = '' }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          required={required}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border rounded-md ${
            errors ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors && <p className="text-red-500 text-xs mt-1">{errors}</p>}
      </div>
    );
  }
);

InputField.displayName = 'InputField';