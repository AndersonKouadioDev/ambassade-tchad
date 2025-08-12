interface InputFieldProps {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    errors?: any[];
    type?: string;
}

export function InputField({
                               label,
                               placeholder,
                               value,
                               onChange,
                               onBlur,
                               errors = [],
                               type = "text",
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
                placeholder={placeholder}
                className={`w-full px-4 py-2 border rounded-md ${
                    errors.length ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.length > 0 && (
                <p className="text-red-500 text-xs mt-1">{errors[0]}</p>
            )}
        </div>
    );
}