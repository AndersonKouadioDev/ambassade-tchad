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

export function InputField({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  errors = undefined,
  type = "text",
  required = false,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={required}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md ${errors ? "border-red-500" : "border-gray-300"
          }`}
      />
      {errors && <p className="text-red-500 text-xs mt-1">{errors}</p>}
    </div>
  );
}
