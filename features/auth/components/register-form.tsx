"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import PhoneInput from "@/components/ui/PhoneInput";

export default function RegisterForm() {
  const t = useTranslations("auth.register");
  const router = useRouter();
  const locale = useLocale();
  const [formData, setFormData] = useState({
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      phoneNumber: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Tous les champs sont obligatoires");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Format d'email invalide");
      return false;
    }

    if (formData.phoneNumber) {
      // Le composant PhoneInput gère déjà la validation et le formatage
      // Vérification basique : doit commencer par + et avoir au moins 10 chiffres pour la Côte d'Ivoire
      const digitsOnly = formData.phoneNumber.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        setError("Le numéro de téléphone doit contenir au moins 10 chiffres");
        return false;
      }
    }

    return true;
  };

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/api/v1/auth/register-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(data.message || "Erreur lors de l'inscription");
        return;
      }

      router.push(`/${locale}/auth?message=inscription_success`);
      
    } catch (err) {
      setLoading(false);
      setError("Erreur réseau ou serveur");
      console.error("Erreur dans handleRegister", err);
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4 max-w-xl ml-0 px-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            Prénom
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            placeholder={t("firstName.placeholder")}
            required
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            placeholder={t("lastName.placeholder")}
            required
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder={t("email.placeholder")}
          required
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Téléphone (optionnel)
        </label>
        <PhoneInput
          value={formData.phoneNumber}
          onChange={handlePhoneChange}
          placeholder={t("phoneNumber.placeholder")}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={t("password.placeholder")}
            required
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder={t("confirmPassword.placeholder")}
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="showPassword"
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="showPassword" className="ml-2 block text-sm text-gray-700">
          Afficher les mots de passe
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        </div>
      )}

      <button
        disabled={loading}
        type="submit"
        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
      >
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
      </button>
    </form>
  );
}