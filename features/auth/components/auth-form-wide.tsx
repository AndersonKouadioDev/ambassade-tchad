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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Side gauche - Image/Illustration */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex flex-col justify-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-6">🏛️</div>
              <h1 className="text-4xl font-bold mb-4">
                Ambassade du Tchad
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Accédez à vos services consulaires en toute simplicité
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span>Demandes de documents officiels</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span>Suivi en temps réel</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                  <span>Service sécurisé et fiable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side droite - Formulaires */}
          <div className="p-12 flex flex-col justify-center">
            {/* Onglets */}
            <div className="flex space-x-1 mb-8 bg-gray-100 p-2 rounded-2xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Contenu des formulaires */}
            <div className="space-y-6">
              {activeTab === "login" && (
                <div className="animate-fadeIn">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Connexion
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Accédez à votre espace personnel
                  </p>
                  <LoginFormWide />
                </div>
              )}

              {activeTab === "register" && (
                <div className="animate-fadeIn">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Inscription
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Créez votre compte pour accéder aux services
                  </p>
                  <RegisterFormWide />
                </div>
              )}

              {activeTab === "forgot" && (
                <div className="animate-fadeIn">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Mot de passe oublié
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Réinitialisez votre mot de passe
                  </p>
                  <ForgotPasswordFormWide />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-500 text-sm">
                En utilisant ce service, vous acceptez nos{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  conditions d'utilisation
                </a>{" "}
                et notre{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  politique de confidentialité
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 