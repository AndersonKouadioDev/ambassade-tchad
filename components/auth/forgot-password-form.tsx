"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordForm() {
    const t = useTranslations('auth.forgotPassword');
    const [showPassword, setShowPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <>
           
            <form className="space-y-6 w-full max-w-2xl border-b-1 border-slate-300 pb-10 mb-20">
            <div className=" bg-[#E2E8F0] text-[#F44C27] text-sm py-4 mb-6">
                <span className="ml-2">{t('alert')}</span>
            </div>
                <div className="w-full">
                    <h2 className="text-lg md:text-xl font-bold text-[#003399] mb-1">{t('title')}</h2>
                    <p className="text-gray-700 mb-4">{t('description')}</p>
                    <hr className="my-4 border-gray-200 w-full" />
                </div>
                <div className="w-full">
                    <label className="block text-sm font-semibold text-[#181F2B] mb-1">{t('oldPassword.label')}</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder={t('oldPassword.placeholder')}
                        className="rounded-full border border-gray-300 px-4 py-3 bg-transparent text-[#181F2B] focus:outline-none focus:ring-2 focus:ring-[#F44C27] mb-2 w-72"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                    />
                </div>
                <div className="w-full">
                    <label className="block text-sm font-semibold text-[#181F2B] mb-1">{t('newPassword.label')}</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder={t('newPassword.placeholder')}
                        className="rounded-full border border-gray-300 px-4 py-3 bg-transparent text-[#181F2B] focus:outline-none focus:ring-2 focus:ring-[#F44C27] mb-2 w-72"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="w-full">
                    <label className="block text-sm font-semibold text-[#181F2B] mb-1">{t('confirmPassword.label')}</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder={t('confirmPassword.placeholder')}
                        className="rounded-full border border-gray-300 px-4 w-72 py-3 bg-transparent text-[#181F2B] focus:outline-none focus:ring-2 focus:ring-[#F44C27] mb-2  "
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 mb-2 w-full">
                    <input
                        id="showPassword"
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(v => !v)}
                        className="rounded border-gray-300"
                    />
                    <label htmlFor="showPassword" className="text-sm text-[#181F2B] select-none">{t('showPassword')}</label>
                </div>
                <div className="flex gap-4 w-full">
                    <button
                        type="submit"
                        className="bg-[#F44C27] hover:bg-[#e13a1a] text-white font-semibold rounded-2xl py-2 px-12 text-base shadow transition-all w-auto"
                    >
                        {t('update')}
                    </button>
                    <button
                        type="button"
                        className="bg-gray-300 text-white font-semibold rounded-2xl py-2 px-12 text-base shadow w-auto cursor-not-allowed"
                        disabled
                    >
                        {t('backToAccount')}
                    </button>
                </div>
            </form>
        </>
    );
} 