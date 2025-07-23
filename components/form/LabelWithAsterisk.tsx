// components/form/LabelWithAsterisk.tsx

type LabelWithAsteriskProps = {
  label: string;
  required?: boolean;
  htmlFor?: string;
};

export default function LabelWithAsterisk({
  label,
  required = false,
  htmlFor,
}: LabelWithAsteriskProps) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}
