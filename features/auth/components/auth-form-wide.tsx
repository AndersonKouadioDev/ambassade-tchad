"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ForgotPasswordFormWide from "./forgot-password-form-wide";
import LoginFormWide from "./login-form-wide";
import RegisterFormWide from "./register-form-wide";

export default function AuthFormWide() {
  const t = useTranslations("auth");
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");

  const tabs = [
    { id: "login", label: t("login.title"), icon: "🔐" },
    { id: "register", label: t("register.title"), icon: "📝" },
    { id: "forgot", label: t("forgotPassword.title"), icon: "🔑" },
  ];

  if (session) {
    router.push("/espace-client/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Side gauche - Image/Illustration */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 md:p-8 lg:p-12 flex flex-col justify-center text-white relative overflow-hidden order-2 lg:order-1">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="text-5xl md:text-6xl mb-4 md:mb-6">🏛️</div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                {t("brand.title")}
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8">
                {t("brand.subtitle")}
              </p>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs md:text-sm">✓</span>
                  </div>
                  <span className="text-sm md:text-base">{t("brand.feature1")}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs md:text-sm">✓</span>
                  </div>
                  <span className="text-sm md:text-base">{t("brand.feature2")}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs md:text-sm">✓</span>
                  </div>
                  <span className="text-sm md:text-base">{t("brand.feature3")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side droite - Formulaires */}
          <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-center order-1 lg:order-2">
            {/* Onglets */}
            <div className="flex space-x-1 mb-6 md:mb-8 bg-gray-100 p-1 md:p-2 rounded-2xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-1 md:space-x-2 py-2 md:py-3 px-2 md:px-4 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                >
                  <span className="text-base md:text-lg">{tab.icon}</span>
                  <span className="text-xs md:text-sm lg:text-base whitespace-nowrap">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Contenu des formulaires */}
            <div className="space-y-4 md:space-y-6">
              {activeTab === "login" && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {t("login.title")}
                  </h2>
                  <p className="text-gray-600 mb-6 md:mb-8">
                    {t("login.subtitle")}
                  </p>
                  <LoginFormWide />
                </div>
              )}

              {activeTab === "register" && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {t("register.title")}
                  </h2>
                  <p className="text-gray-600 mb-6 md:mb-8">
                    {t("register.subtitle")}
                  </p>
                  <RegisterFormWide />
                </div>
              )}

              {activeTab === "forgot" && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {t("forgotPassword.title")}
                  </h2>
                  <p className="text-gray-600 mb-6 md:mb-8">
                    {t("forgotPassword.subtitle")}
                  </p>
                  <ForgotPasswordFormWide />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
              <p className="text-center text-gray-500 text-xs md:text-sm">
                {t("terms.text")}{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  {t("terms.conditions")}
                </a>{" "}
                {t("terms.and")}{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  {t("terms.policy")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}