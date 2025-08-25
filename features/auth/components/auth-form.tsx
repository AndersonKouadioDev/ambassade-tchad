"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, UserPlus, Key } from "lucide-react";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import ForgotPasswordForm from "./forgot-password-form";

type AuthTab = "login" | "register" | "forgot-password";

export default function AuthForm() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = (searchParams.get("tab") as AuthTab) || "login";
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const message = searchParams.get("message");

  // Sync state with URL parameter on mount and when params change
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "register" || tabParam === "forgot-password") {
      setActiveTab(tabParam as AuthTab);
    } else {
      setActiveTab("login");
    }
    // Handle inscription success message
    if (message === "inscription_success") {
      setActiveTab("login");
    }
  }, [searchParams, message]);

  const handleTabChange = (tabId: AuthTab) => {
    setActiveTab(tabId);
    const newParams = new URLSearchParams(searchParams.toString());
    if (tabId === "login") {
      newParams.delete("tab");
    } else {
      newParams.set("tab", tabId);
    }
    // Bug fix: Add { scroll: false } to prevent the page from scrolling to the top
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

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
    <div className="w-full min-h-screen bg-gray-50 px-4 flex items-center justify-center py-8">
      <div className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-2xl">
        {/* Left decorative panel */}
        <div className="hidden md:flex flex-1 bg-gradient-to-b from-primary to-blue-800 p-12 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-texture opacity-10" />
          <div className="text-white text-center space-y-4 relative z-10">
            <div className="mx-auto w-28 h-28 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
              <Image
                src="/assets/images/logo.png"
                alt="Logo Ambassade du Tchad"
                width={90}
                height={90}
              />
            </div>
            <h2 className="text-3xl font-bold">Ambassade du Tchad</h2>
            <p className="text-blue-100 text-sm max-w-xs mx-auto">
              Accédez à votre espace sécurisé pour gérer vos services
              consulaires.
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="w-full max-w-lg md:max-w-xl mx-auto flex flex-col justify-center bg-white p-6 sm:p-10 overflow-y-auto">
          {/* Success message */}
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

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {activeTab === "login" && t("login.title")}
              {activeTab === "register" && t("register.title")}
              {activeTab === "forgot-password" && t("forgotPassword.title")}
            </h2>
            <p className="text-gray-500">
              {activeTab === "login" && "Accédez à votre espace personnel."}
              {activeTab === "register" &&
                "Créez votre compte en quelques étapes."}
              {activeTab === "forgot-password" &&
                "Réinitialisez votre mot de passe."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 p-1 rounded-xl shadow-inner">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as AuthTab)}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                    activeTab === tab.id
                      ? "bg-white text-primary shadow-sm"
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

          {/* Active Form */}
          <div className="mt-4">{renderForm()}</div>
        </div>
      </div>
    </div>
  );
}
