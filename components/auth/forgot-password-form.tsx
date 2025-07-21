"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordForm() {
    const t = useTranslations('auth.forgotPassword');
    const router = useRouter();
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

            // Succès
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
            <div className="max-w-md mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-full bg-white/80 rounded-xl shadow-lg p-8">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center mb-2 shadow-md">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">Email envoyé !</h2>
                        <p className="text-gray-500 text-sm text-center">
                            Un email de réinitialisation a été envoyé à votre adresse email.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/auth')}
                        className="w-full py-2 rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold shadow-md"
                    >
                        Retour à la connexion
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full bg-white/80 rounded-xl shadow-lg p-8">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-red-400 flex items-center justify-center mb-2 shadow-md">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{t('title')}</h2>
                    <p className="text-gray-500 text-sm text-center">{t('description')}</p>
                </div>

                <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder={t('email.placeholder')}
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input input-bordered rounded-lg px-4 py-2"
                        autoFocus
                    />

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <button
                        disabled={loading}
                        type="submit"
                        className="btn-primary w-full py-2 rounded-lg bg-gradient-to-tr from-orange-500 to-red-400 text-white font-semibold shadow-md"
                    >
                        {loading ? t('loading') : t('submit')}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push('/auth')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Retour à la connexion
                    </button>
                </form>
            </div>
        </div>
    );
} 