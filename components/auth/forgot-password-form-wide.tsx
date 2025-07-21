"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ForgotPasswordFormWide() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Un email de réinitialisation a été envoyé à votre adresse email.");
        setEmail("");
      } else {
        setError(data.message || "Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
          {success}
        </div>
      )}

      <div className="text-center mb-6">
        <div className="text-4xl mb-4">🔑</div>
        <p className="text-gray-600 text-lg">
          Entrez votre adresse email pour recevoir un lien de réinitialisation
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          {t("forgotPassword.email")}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">📧</span>
          </div>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder={t("forgotPassword.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Envoi en cours...</span>
          </div>
        ) : (
          t("forgotPassword.submit")
        )}
      </button>

      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600">
          {t("forgotPassword.rememberPassword")}{" "}
          <button
            type="button"
            onClick={() => window.location.href = "/auth?tab=login"}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {t("forgotPassword.backToLogin")}
          </button>
        </p>
        
        <p className="text-sm text-gray-600">
          {t("forgotPassword.noAccount")}{" "}
          <button
            type="button"
            onClick={() => window.location.href = "/auth?tab=register"}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {t("forgotPassword.createAccount")}
          </button>
        </p>
      </div>
    </form>
  );
} 