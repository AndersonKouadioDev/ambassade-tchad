"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function LoginForm() {
    const t = useTranslations('auth.login');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // L'alerte est toujours affichée comme sur la capture

    return (
        <>
           
            <form onSubmit={e => { e.preventDefault(); }} className="space-y-6 w-full max-w-2xl border-b-1    pb-10 mb-20 ">
            <div className="w-full  bg-[#E2E8F0] text-[#F44C27] text-sm   py-4 mb-6">
                <span className="ml-2">{t('alert')}</span>
            </div>
                <div className="w-full">
                    <h2 className="text-xl md:text-2xl font-bold text-[#003399] mb-1">{t('title')}</h2>
                    <p className="text-gray-700 mb-4">{t('subtitle')}</p>
                    <hr className="my-4 border-gray-200 w-full" />
                </div>
                <div className="w-full">
                    <label className="block text-sm font-semibold text-[#181F2B] mb-1">{t('email.label')} <span className="text-black">*</span></label>
                    <div className="text-xs text-gray-400 mb-1">{t('email.help')}</div>
                    <input
                        type="email"
                        required
                        placeholder={t('email.placeholder')}
                        className="rounded-full border border-gray-300 px-4 py-3 bg-transparent text-[#181F2B] focus:outline-none focus:ring-2 focus:ring-[#F44C27] mb-2 w-72"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="w-full">
                    <label className="block text-sm font-semibold text-[#181F2B] mb-1">{t('password.label')} <span className="text-black">*</span></label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder={t('password.placeholder')}
                        className="rounded-full border border-gray-300 px-4 py-3 bg-transparent text-[#181F2B] focus:outline-none focus:ring-2 focus:ring-[#F44C27] mb-2 w-72"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 mb-2 w-72">
                    <input
                        id="showPassword"
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(v => !v)}
                        className="rounded border-gray-300"
                    />
                    <label htmlFor="showPassword" className="text-sm text-[#181F2B] select-none">{t('showPassword')}</label>
                </div>
                <button
                    type="submit"
                    className="bg-[#F44C27] hover:bg-[#e13a1a] text-white font-semibold rounded-2xl py-2 px-12 text-base shadow transition-all mb-2 w-auto"
                >
                    {t('submit')}
                </button>
                <div className="flex items-center gap-2 mb-6 w-full">
                    <span className="text-[#181F2B] text-lg">&#9432;</span>
                    <Link href="/auth/forgot-password" className="text-[#003399] text-sm font-semibold underline hover:text-[#F44C27]">{t('forgotPassword')}</Link>
                </div>
                <hr className="my-4 border-gray-200 w-full" />
                <div className="flex flex-col items-start gap-2 w-full">
                    <span className="text-[#003399] font-bold text-base">{t('newUser')}</span>
                    <button
                        type="button"
                        className="bg-[#F44C27] hover:bg-[#e13a1a] text-white font-semibold rounded-2xl px-12 py-2 text-base shadow transition-all w-auto"
                    >
                        {t('createAccount')}
                    </button>
                </div>
            </form>
        </>
    );
} 