'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function ProfilSection() {
  const t = useTranslations('espaceClient.profil');
  const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'password'>('view');
  const [formData, setFormData] = useState({
    nom: 'Dupont',
    prenom: 'Jean',
    langue: 'francais'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  return (
    <div className="w-full">
      <div className=" mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('title')}</h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6">{t('description')}</p>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
          {/* Header avec bouton modifier mot de passe */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">{t('modifierCompte')}</div>
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('password')}
                className="bg-orange-500 text-white rounded-lg px-8 py-2 font-semibold text-base shadow-md hover:bg-orange-600 transition"
              >
                {t('modifierMotDePasse')}
              </button>
              <button className="bg-gray-300 dark:bg-gray-700 text-white rounded-lg px-8 py-2 font-semibold text-base shadow-md cursor-not-allowed">{t('supprimerCompte')}</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('view')}
              className={`px-6 py-3 font-semibold text-base transition-colors ${
                activeTab === 'view'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t('voirProfil')}
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-6 py-3 font-semibold text-base transition-colors ${
                activeTab === 'edit'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t('modifierProfil')}
            </button>
          </div>
          {/* Tab Content */}
          {activeTab === 'view' && (
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('monIdentite')}</div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-row gap-x-6">
                  <div className="w-80">
                    <label className="block text-gray-900 dark:text-white font-semibold mb-2">{t('nom')}</label>
                    <div className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-2 text-gray-900 dark:text-white text-base">
                      {formData.nom}
                    </div>
                  </div>
                  <div className="w-80">
                    <label className="block text-gray-900 dark:text-white font-semibold mb-2">{t('prenom')}</label>
                    <div className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-2 text-gray-900 dark:text-white text-base">
                      {formData.prenom}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-x-6">
                  <div className="w-80">
                    <label className="block text-gray-900 dark:text-white font-semibold mb-2">{t('langueLabel')}</label>
                    <div className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-2 text-gray-900 dark:text-white text-base">
                      {t(formData.langue)}
                    </div>
                  </div>
                  <div className="w-80"></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'edit' && (
            <div>
              <div className="text-base text-gray-900 dark:text-white mb-2">{t('champsObligatoires')}</div>
              <div className="border-t border-gray-200 dark:border-gray-700 my-6" />
              <div className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('monIdentite')}</div>
              <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); setActiveTab('view'); }}>
                <div className="flex flex-row gap-x-6">
                  <div className="w-80">
                    <label className="block text-gray-900 dark:text-white font-semibold mb-2">{t('nom')} *</label>
                    <input 
                      type="text" 
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-2 text-gray-900 dark:text-white text-base focus:outline-none focus:border-orange-500" 
                    />
                  </div>
                  <div className="w-80">
                    <label className="block text-gray-900 dark:text-white font-semibold mb-2">{t('prenom')} *</label>
                    <input 
                      type="text" 
                      value={formData.prenom}
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                      className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-2 text-gray-900 dark:text-white text-base focus:outline-none focus:border-orange-500" 
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-x-6">
                  <div className="w-80">
                    <label className="block text-gray-900 dark:text-white font-semibold mb-2">{t('langueLabel')} *</label>
                    <select 
                      value={formData.langue}
                      onChange={(e) => setFormData({...formData, langue: e.target.value})}
                      className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-2 text-gray-900 dark:text-white text-base focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      <option value="francais" className="dark:bg-gray-900">{t('francais')}</option>
                      <option value="anglais" className="dark:bg-gray-900">{t('anglais')}</option>
                      <option value="arabe" className="dark:bg-gray-900">{t('arabe')}</option>
                    </select>
                  </div>
                  <div className="w-80"></div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button type="submit" className="bg-orange-500 text-white rounded-lg px-12 py-2 font-semibold text-base shadow-md hover:bg-orange-600 transition">{t('enregistrer')}</button>
                  <button type="button" onClick={() => setActiveTab('view')} className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg px-12 py-2 font-semibold text-base shadow-md hover:bg-gray-400 dark:hover:bg-gray-600 transition">{t('annuler')}</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div>
              <div className="text-base text-gray-900 dark:text-white mb-2">{t('champsObligatoires')}</div>
              <div className="border-t border-gray-200 dark:border-gray-700 my-6" />
              <div className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('modifierMotDePasse')}</div>
              <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); setActiveTab('view'); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}>
                <div className="flex flex-col gap-6">
                  <div className="w-80">
                    <label className="block text-gray-900 dark:text-white font-semibold mb-2">{t('motDePasseActuel')} *</label>
                    <input 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-2 text-gray-900 dark:text-white text-base focus:outline-none focus:border-orange-500" 
                    />
                  </div>
                  <div className="w-80">
                    <label className="block text-gray-900 dark:text-white font-semibold mb-2">{t('nouveauMotDePasse')} *</label>
                    <input 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-2 text-gray-900 dark:text-white text-base focus:outline-none focus:border-orange-500" 
                    />
                  </div>
                  <div className="w-80">
                    <label className="block text-gray-900 dark:text-white font-semibold mb-2">{t('confirmerMotDePasse')} *</label>
                    <input 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-2 text-gray-900 dark:text-white text-base focus:outline-none focus:border-orange-500" 
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button type="submit" className="bg-orange-500 text-white rounded-lg px-12 py-2 font-semibold text-base shadow-md hover:bg-orange-600 transition">{t('modifierMotDePasse')}</button>
                  <button type="button" onClick={() => setActiveTab('view')} className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg px-12 py-2 font-semibold text-base shadow-md hover:bg-gray-400 dark:hover:bg-gray-600 transition">{t('annuler')}</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 