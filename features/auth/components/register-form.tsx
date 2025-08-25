"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { register } from "../actions/auth.action";
import { RegisterDTO } from "../schemas/auth.schema";
import PhoneInput from "@/components/ui/PhoneInput";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  const t = useTranslations("auth.register");
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterDTO>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumber: value,
    }));
  };

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await register(formData);

      if (result.success) {
        router.push(`/auth?message=inscription_success`);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Une erreur est survenue lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleRegister}
      className="space-y-6 w-full max-w-lg mx-auto overflow-y-auto"
    >
      {/* First Name & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            type="text"
            name="firstName"
            placeholder={t("firstName.placeholder")}
            required
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            type="text"
            name="lastName"
            placeholder={t("lastName.placeholder")}
            required
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder={t("email.placeholder")}
          required
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Téléphone (optionnel)</Label>
        <PhoneInput
          value={formData.phoneNumber}
          onChange={handlePhoneChange}
          placeholder={t("phoneNumber.placeholder")}
          className="w-full"
        />
      </div>

      {/* Password & Confirm Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("password.placeholder")}
              required
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder={t("confirmPassword.placeholder")}
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Show Password Checkbox */}
      <div className="flex items-center pt-2">
        <input
          id="showPasswordToggle" // Changed ID to avoid conflict with input type
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label
          htmlFor="showPasswordToggle"
          className="ml-2 block text-sm text-gray-700"
        >
          Afficher les mots de passe
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-600 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Inscription en cours...
          </span>
        ) : (
          "S'inscrire"
        )}
      </Button>
    </form>
  );
}
