"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from "next-intl";

export default function ForgotPasswordForm() {
    const t = useTranslations('auth.forgotPassword');
    const router = useRouter();
    const locale = useLocale();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setSuccess(false);
        
        if (!email) {
            setError('Veuillez saisir votre adresse email');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Format d\'email invalide');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:8081/api/v1/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            setLoading(false);

            if (!response.ok) {
                setError(data.message || 'Erreur lors de l\'envoi de l\'email');
                return;
            }

            setSuccess(true);
            setEmail('');
            
        } catch (err) {
            setLoading(false);
            setError('Erreur réseau ou serveur');
            console.error('Erreur dans handleForgotPassword', err);
        }
    }

    if (success) {
        return (
            <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Email envoyé !</h3>
                <p className="text-gray-500">
                    Un email de réinitialisation a été envoyé à votre adresse email.
                </p>
                <button
                    onClick={() => router.push(`/${locale}/auth`)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium"
                >
                    Retour à la connexion
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleForgotPassword} className="space-y-6 max-w-lg ml-0 px-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse Email
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-[100px] py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
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
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
                {loading ? 'Envoi en cours...' : 'Envoyer'}
            </button>

        </form>
    );
}