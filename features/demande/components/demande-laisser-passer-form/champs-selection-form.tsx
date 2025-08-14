"use client";

import React from 'react';

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  errors?: string;
  required?: boolean;
  className?: string;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, value, options, onChange, onBlur, errors, required = false, className = '' }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
        <select
          ref={ref}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          className={`w-full px-4 py-2 border rounded-md ${
            errors ? 'border-red-500' : 'border-gray-300'
          }`}
        >
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
);

SelectField.displayName = 'SelectField';