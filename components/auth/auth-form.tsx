"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import ForgotPasswordForm from "./forgot-password-form";

type AuthTab = "login" | "register" | "forgot-password";

export default function AuthForm() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const message = searchParams.get("message");

  // Si il y a un message de succès d'inscription, afficher l'onglet login
  if (message === "inscription_success" && activeTab !== "login") {
    setActiveTab("login");
  }

  const tabs = [
    { id: "login", label: t("login.title"), icon: "🔐" },
    { id: "register", label: t("register.title"), icon: "📝" },
    { id: "forgot-password", label: t("forgotPassword.title"), icon: "🔑" },
  ];

  const renderForm = () => {
    switch (activeTab) {
      case "login":
        return <LoginForm />;
      case "register":
        return <RegisterForm />;
      case "forgot-password":
        return <ForgotPasswordForm />;
      default:
        return <LoginForm />;
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full bg-white/80 rounded-xl shadow-lg p-8">
        {/* Message de succès d'inscription */}
        {message === "inscription_success" && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">
                Inscription réussie ! Vous pouvez maintenant vous connecter.
              </span>
            </div>
          </div>
        )}

        {/* Onglets */}
        <div className="flex mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AuthTab)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Formulaire actif */}
        <div className="mt-6">
          {renderForm()}
        </div>

        {/* Liens de navigation entre onglets */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          {activeTab === "login" && (
            <div className="flex flex-col sm:flex-row gap-4 text-center">
              <button
                onClick={() => setActiveTab("register")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Pas encore de compte ? S'inscrire
              </button>
              <button
                onClick={() => setActiveTab("forgot-password")}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}

          {activeTab === "register" && (
            <div className="text-center">
              <button
                onClick={() => setActiveTab("login")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Déjà un compte ? Se connecter
              </button>
            </div>
          )}

          {activeTab === "forgot-password" && (
            <div className="text-center">
              <button
                onClick={() => setActiveTab("login")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Retour à la connexion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
