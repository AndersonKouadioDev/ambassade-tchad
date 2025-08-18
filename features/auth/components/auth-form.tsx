"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Lock, UserPlus, Key } from "lucide-react";
// import { useLocale } from "next-intl";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import ForgotPasswordForm from "./forgot-password-form";

type AuthTab = "login" | "register" | "forgot-password";

export default function AuthForm() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  // const locale = useLocale();
  const [activeTab, setActiveTab] = useState<AuthTab>(() => {
    const tab = searchParams.get("tab");
    if (tab === "register" || tab === "forgot-password") {
      return tab as AuthTab;
    }
    return "login";
  });
  const message = searchParams.get("message");

  // Si il y a un message de succès d'inscription, afficher l'onglet login
  if (message === "inscription_success" && activeTab !== "login") {
    setActiveTab("login");
  }

  const tabs = [
    { id: "login", label: t("login.title"), icon: Lock },
    { id: "register", label: t("register.title"), icon: UserPlus },
    { id: "forgot-password", label: t("forgotPassword.title"), icon: Key },
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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 px-4 flex items-center justify-center py-8">
      <div className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-xl bg-white">
        {/* Left decorative panel */}
        <div className="hidden md:flex flex-1 bg-gradient-to-b from-blue-600 to-blue-800 p-8 items-center justify-center">
          <div className="text-white bg-red text-center space-y-4">
            <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Image
                src="/assets/images/logo.png"
                alt="Logo Ambassade du Tchad"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <h2 className="text-2xl font-bold">Ambassade du Tchad</h2>
            <p className="text-blue-100 text-sm max-w-xs mx-auto">
              Accédez à votre espace sécurisé pour gérer vos services
              consulaires
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="w-full max-w-lg md:max-w-xl mx-auto flex items-center border border-gray-100 p-4 sm:p-8 flex-col justify-center bg-white overflow-y-auto">
          {/* Message de succès d'inscription */}
          {message === "inscription_success" && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Inscription réussie ! Vous pouvez maintenant vous connecter.
                </span>
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {activeTab === "login" && t("login.title")}
              {activeTab === "register" && t("register.title")}
              {activeTab === "forgot-password" && t("forgotPassword.title")}
            </h2>
            <p className="text-gray-500 mt-2">
              {activeTab === "login" && "Accédez à votre espace personnel"}
              {activeTab === "register" &&
                "Créez votre compte en quelques étapes"}
              {activeTab === "forgot-password" &&
                "Réinitialisez votre mot de passe"}
            </p>
          </div>

          {/* Onglets */}
          <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as AuthTab);
                    const url = new URL(window.location.href);
                    if (tab.id === "login") {
                      url.searchParams.delete("tab");
                    } else {
                      url.searchParams.set("tab", tab.id);
                    }
                    window.history.replaceState({}, "", url.toString());
                  }}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors rounded-md ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Formulaire actif */}
          <div className="mt-4">{renderForm()}</div>
        </div>
      </div>
    </div>
  );
}
