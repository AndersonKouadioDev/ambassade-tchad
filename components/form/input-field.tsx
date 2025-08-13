import { ChangeEvent } from "react";

export type InputFieldTypeProps =
  | "text"
  | "date"
  | "range"
  | "number"
  | "select"
  | "checkbox"
  | "radio"
  | "textarea"
  | "password"
  | "email"
  | "tel"
  | "url"
  | "search"
  | "color"
  | "file";

export type InputFieldValueProps =
  | string
  | number
  | boolean
  | FileList
  | undefined;
interface InputFieldProps {
  label: string;
  value: InputFieldValueProps;
  onChange: (value: InputFieldValueProps) => void;
  onBlur: () => void;
  errors?: string;
  type?: InputFieldTypeProps;
  placeholder?: string;
  options?: {value: string, label: string}[]; // Pour les champs select et radio
  name?: string; // Pour les champs radio et checkbox
  min?: number; // Pour les champs number et range
  max?: number; // Pour les champs number et range
  step?: number; // Pour le champ number et range
}

export function InputField({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  errors = undefined,
  type = "text",
  options,
  name,
  min,
  max,
  step,
}: InputFieldProps) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    let newValue: InputFieldValueProps;

    switch (type) {
      case "number":
      case "range":
        newValue = parseFloat(target.value) || undefined;
        break;
      case "checkbox":
        newValue = (target as HTMLInputElement).checked;
        break;
      case "file":
        newValue = (target as HTMLInputElement).files || undefined;
        break;
      default:
        newValue = target.value;
        break;
    }
    onChange(newValue);
  };

  const inputClasses = `w-full px-4 py-2 border rounded-md ${
    errors ? "border-red-500" : "border-gray-300"
  } focus:ring-blue-500 focus:border-blue-500`;

  switch (type) {
    case "select":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <select
            value={value as string}
            onChange={handleChange}
            onBlur={onBlur}
            className={inputClasses}
          >
            <option value="">Sélectionnez...</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors && <p className="text-red-500 text-xs mt-1">{errors}</p>}
        </div>
      );

    case "textarea":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <textarea
            value={value as string}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={`${inputClasses} h-24 resize-none`}
          />
          {errors && <p className="text-red-500 text-xs mt-1">{errors}</p>}
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            name={name}
            checked={value as boolean}
            onChange={handleChange}
            onBlur={onBlur}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor={name} className="ml-2 text-sm text-gray-700">
            {label}
          </label>
          {errors && <p className="text-red-500 text-xs mt-1">{errors}</p>}
        </div>
      );

    case "radio":
      return (
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </p>
          <div className="mt-2 space-y-2">
            {options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={option.value}
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={handleChange}
                  onBlur={onBlur}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label
                  htmlFor={option.value}
                  className="ml-3 block text-sm text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          {errors && <p className="text-red-500 text-xs mt-1">{errors}</p>}
        </div>
      );

    default: // Pour les types 'text', 'date', 'number', 'password', 'email', 'tel', etc.
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <input
            type={type}
            value={value as string | number}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={inputClasses}
            min={min}
            max={max}
            step={step}
          />
          {errors && <p className="text-red-500 text-xs mt-1">{errors}</p>}
        </div>
      );
  }
}
