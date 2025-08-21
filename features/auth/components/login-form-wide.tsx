"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginFormWide() {
  const t = useTranslations("auth");
  const router = useRouter();
  
  // Utilisation de URLSearchParams côté client au lieu de useSearchParams
  const callbackUrl = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).get("callbackUrl") || "/espace-client/dashboard"
    : "/espace-client/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError(t("login.errors.requiredFields"));
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email: formData.email.trim(),
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("login.errors.invalidCredentials"));
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(t("login.errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("login.email")}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              placeholder={t("login.emailPlaceholder") || "email@example.com"}
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("login.password")}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? t("login.hidePassword") : t("login.showPassword")}
            </button>
          </div>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="current-password"
              required
              placeholder={t("login.passwordPlaceholder") || "••••••••"}
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between text-sm mb-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 text-gray-700">
              {t("login.rememberMe")}
            </label>
          </div>
          <button
            type="button"
            onClick={() => router.push('/auth/forgot-password')}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
          >
            {t("login.forgotPassword")}
          </button>
        </div>

        {/* Submit Button */}
        <div className="space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>{t("login.signingIn")}</span>
              </div>
            ) : (
              t("login.submit")
            )}
          </button>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              {t("login.noAccount")}{" "}
              <button
                type="button"
                onClick={() => router.push('/auth/register')}
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                {t("login.createAccount")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}