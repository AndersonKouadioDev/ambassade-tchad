"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const t = useTranslations("auth.register");
  const router = useRouter();
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

    // Validation du numéro de téléphone
    if (formData.phoneNumber) {
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        setError("Format de téléphone invalide. Utilisez le format international avec l'indicatif du pays (ex: +225XXXXXXXXX)");
        return false;
      }
      
      if (formData.phoneNumber.length > 20) {
        setError("Le numéro de téléphone ne doit pas dépasser 20 caractères");
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

      // Inscription réussie
      console.log("Inscription réussie:", data);
      setError("");
      
      // Rediriger vers la page de connexion avec un message de succès
      router.push("/auth?message=inscription_success");
      
    } catch (err) {
      setLoading(false);
      setError("Erreur réseau ou serveur");
      console.error("Erreur dans handleRegister", err);
    }
  }

  return (
    <div className="max-w-md mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full bg-white/80 rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center mb-2 shadow-md">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{t("title")}</h2>
          <p className="text-gray-500 text-sm text-center">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              placeholder={t("firstName.placeholder")}
              required
              value={formData.firstName}
              onChange={handleInputChange}
              className="input input-bordered rounded-lg px-4 py-2"
            />
            <input
              type="text"
              name="lastName"
              placeholder={t("lastName.placeholder")}
              required
              value={formData.lastName}
              onChange={handleInputChange}
              className="input input-bordered rounded-lg px-4 py-2"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder={t("email.placeholder")}
            required
            value={formData.email}
            onChange={handleInputChange}
            className="input input-bordered rounded-lg px-4 py-2"
          />

          <input
            type="tel"
            name="phoneNumber"
            placeholder={t("phoneNumber.placeholder")}
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="input input-bordered rounded-lg px-4 py-2"
          />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={t("password.placeholder")}
            required
            value={formData.password}
            onChange={handleInputChange}
            className="input input-bordered rounded-lg px-4 py-2"
          />

          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder={t("confirmPassword.placeholder")}
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="input input-bordered rounded-lg px-4 py-2"
          />

          <div className="flex items-center gap-2">
            <input
              id="showPassword"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="rounded border-gray-300"
            />
            <label htmlFor="showPassword" className="text-sm text-gray-600">
              {t("showPassword")}
            </label>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            disabled={loading}
            type="submit"
            className="btn-primary w-full py-2 rounded-lg bg-gradient-to-tr from-green-500 to-emerald-400 text-white font-semibold shadow-md"
          >
            {loading ? t("loading") : t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
} 