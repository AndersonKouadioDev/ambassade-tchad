import React, { useState } from "react";
import Image from "next/image";
import { Images } from "lucide-react";
import { Link } from '@/i18n/navigation';

export type FieldType =
  | { type: "text"; name: string; label: string; placeholder?: string }
  | { type: "select"; name: string; label: string; options: { value: string; label: string }[] }
  | { type: "file"; name: string; label: string; accept?: string }
  | { type: "textarea"; name: string; label: string; placeholder?: string; className?: string };

export type ButtonType =
  | { label: string; type: "submit"; variant?: "primary" | "outline" }
  | { label: string; type: "link"; href: string; variant?: "primary" | "outline" }
  | { label: string; type: "button"; onClick: () => void; variant?: "primary" | "outline" };

interface FormulaireGeneriqueProps {
  title: string;
  logoSrc?: string;
  description?: string;
  fields: FieldType[];
  buttons: ButtonType[];
  onSubmit: (values: Record<string, unknown>) => void;
}

export default function FormulaireGenerique({
  title,
  logoSrc,
  description,
  fields,
  buttons,
  onSubmit,
}: FormulaireGeneriqueProps) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) {
    const target = e.target;
    const { name, value } = target;
    if (target instanceof HTMLInputElement && target.type === "file" && target.files && target.files[0]) {
      setValues((v) => ({ ...v, [name]: target.files![0] }));
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFilePreviews((prev) => ({ ...prev, [name]: ev.target?.result as string }));
      };
      reader.readAsDataURL(target.files[0]);
    } else {
      setValues((v) => ({ ...v, [name]: value }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <div className="flex items-center justify-center w-full p-10 min-h-[calc(100vh-70px)] bg-white dark:bg-gray-900">
      <div className="relative w-full max-w-5xl mx-auto bg-white dark:bg-gray-900 p-6 pt-0">
        {/* Header */}
        <div className="text-center mb-8   ">
          <h1 className="text-gray-400 text-center dark:text-white mb-4 text-2xl ">{title}</h1>
          {logoSrc && (
            <div className="flex items-center justify-center gap-4">
              <Image
                src={logoSrc}
                alt="logo"
                width={750}
                height={300}
                className="mx-2"
              />
            </div>
          )}
          {description && <div className="text-gray-500 dark:text-gray-300 mt-2">{description}</div>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {fields.map((field) => {
              if (field.type === "file") {
                return (
                  <div key={field.name} className="col-span-1 md:col-span-2 flex flex-col items-center mb-4">
                    <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-80 relative">
                      {filePreviews[field.name] ? (
                        <Image src={filePreviews[field.name]} alt={field.label} fill className="object-cover rounded-lg" />
                      ) : (
                        <Images className="mx-auto mb-2 text-gray-400" size={24} />
                      )}
                      <input
                        type="file"
                        name={field.name}
                        accept={field.accept}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        aria-label={field.label}
                        onChange={handleChange}
                      />
                    </div>
                    <span className="mt-2 text-gray-500 dark:text-gray-300 text-sm">{field.label}</span>
                  </div>
                );
              }
              if (field.type === "select") {
                return (
                  <div key={field.name}>
                    <select
                      name={field.name}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-800 rounded-3xl bg-white dark:bg-gray-900 text-gray-700 dark:text-white"
                      value={values[field.name] as string || ""}
                      onChange={handleChange}
                    >
                      <option value="" disabled hidden>
                        {field.label}
                      </option>
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="dark:bg-gray-900">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }
              if (field.type === "textarea") {
                return (
                  <div key={field.name}>
                    <textarea
                      name={field.name}
                      placeholder={field.placeholder || field.label}
                      className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-800 rounded-3xl bg-white dark:bg-gray-900 text-gray-700 dark:text-white resize-none ${(field.className || "")}`}
                      value={values[field.name] as string || ""}
                      onChange={handleChange}
                    />
                  </div>
                );
              }
              // text input
              return (
                <div key={field.name}>
                  <input
                    type="text"
                    name={field.name}
                    placeholder={field.placeholder || field.label}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-3xl bg-white dark:bg-gray-900 text-gray-700 dark:text-white"
                    value={values[field.name] as string || ""}
                    onChange={handleChange}
                  />
                </div>
              );
            })}
          </div>
          {/* Boutons */}
          <div className="flex justify-between mx-20">
            {buttons.map((btn) => {
              if (btn.type === "link") {
                return (
                  <Link href={btn.href} key={btn.label}>
                    <button
                      type="button"
                      className={
                        btn.variant === "outline"
                          ? "bg-transparent text-secondary border border-secondary px-6 py-2 rounded-full"
                          : "bg-secondary text-white px-6 py-2 rounded-full"
                      }
                    >
                      {btn.label}
                    </button>
                  </Link>
                );
              }
              if (btn.type === "button") {
                return (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={btn.onClick}
                    className={
                      btn.variant === "outline"
                        ? "bg-transparent text-secondary border border-secondary px-6 py-2 rounded-full"
                        : "bg-secondary text-white px-6 py-2 rounded-full"
                    }
                  >
                    {btn.label}
                  </button>
                );
              }
              // submit
              return (
                <button
                  key={btn.label}
                  type="submit"
                  className={
                    btn.variant === "outline"
                      ? "bg-transparent text-secondary border border-secondary px-6 py-2 rounded-full"
                      : "bg-secondary text-white px-6 py-2 rounded-full"
                  }
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </form>
      </div>
    </div>
  );
}