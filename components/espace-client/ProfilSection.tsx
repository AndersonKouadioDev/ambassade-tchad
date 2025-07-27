'use client';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';

export default function ProfilSection() {
  const t = useTranslations('espaceClient.profil');
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'password'>('view');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
    edit: false
  });
  const prevTab = useRef(activeTab);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.token) return;
      try {
        const res = await fetch('http://localhost:8081/api/v1/auth/demandeur/profile', {
          headers: {
            'Authorization': `Bearer ${session.user.token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Erreur lors du chargement du profil');
        const data = await res.json();
        setFormData({
          nom: data.lastName || '',
          prenom: data.firstName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          password: ''
        });
      } catch (e) {
        toast.error('Erreur lors du chargement du profil');
      }
    };
    fetchProfile();
  }, [session]);

  useEffect(() => {
    if (activeTab === 'password' && prevTab.current !== 'password') {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
    prevTab.current = activeTab;
  }, [activeTab]);
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.token) return;
    try {
      const res = await fetch('http://localhost:8081/api/v1/auth/demandeur/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.prenom,
          lastName: formData.nom,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        }),
      });
      if (!res.ok) throw new Error('Erreur lors de la modification du profil');
      toast.success('Profil modifié avec succès !');
      setActiveTab('view');
    } catch (e) {
      toast.error('Échec de la mise à jour du profil');
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.token) return;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,15}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      toast.error('Le mot de passe doit contenir entre 8 et 15 caractères, une minuscule, une majuscule, un chiffre et un caractère spécial.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('La confirmation du mot de passe ne correspond pas.');
      return;
    }
    try {
      const res = await fetch('http://localhost:8081/api/v1/auth/demandeur/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });
      if (!res.ok) throw new Error('Erreur lors de la modification du mot de passe');
      
      toast.success('Mot de passe changé avec succès ! Vous allez être déconnecté pour vous reconnecter avec votre nouveau mot de passe.');
      setActiveTab('view');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      signOut(); // Déconnexion automatique après le changement de mot de passe réussi
    } catch (e) {
      toast.error('Échec du changement de mot de passe');
    }
  };

  // Ajout pour checklist visuelle
  const passwordChecklist = [
    { label: 'Entre 8 et 15 caractères', test: (v: string) => v.length >= 8 && v.length <= 15 },
    { label: 'Une minuscule', test: (v: string) => /[a-z]/.test(v) },
    { label: 'Une majuscule', test: (v: string) => /[A-Z]/.test(v) },
    { label: 'Un chiffre', test: (v: string) => /\d/.test(v) },
    { label: 'Un caractère spécial', test: (v: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v) },
  ];

  return (
    <div className="w-full">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('title')}</h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6">{t('description')}</p>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">{t('modifierCompte')}</div>
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('password')}
                className="bg-orange-500 text-white rounded-lg px-8 py-2 font-semibold text-base shadow-md hover:bg-orange-600 transition"
              >
                {t('modifierMotDePasse')}
              </button>
              <button className="bg-gray-300 dark:bg-gray-700 text-white rounded-lg px-8 py-2 font-semibold text-base shadow-md cursor-not-allowed">
                {t('supprimerCompte')}
              </button>
            </div>
          </div>

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
                    <label className="block text-gray-900 dark:text-white font-semibold mb-2">Email</label>
                    <div className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-2 text-gray-900 dark:text-white text-base">
                      {formData.email}
                    </div>
                  </div>
                  <div className="w-80">
                    <label className="block text-gray-900 dark:text-white font-semibold mb-2">Téléphone</label>
                    <div className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-2 text-gray-900 dark:text-white text-base">
                      {formData.phoneNumber}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'edit' && (
            <div>
              <div className="text-base text-gray-900 dark:text-white mb-2">{t('champsObligatoires')}</div>
              <div className="border-t border-gray-200 dark:border-gray-700 my-6" />
              <div className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('monIdentite')}</div>
              <form className="flex flex-col gap-6" onSubmit={handleEditSubmit}>
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
                    <label className="block text-gray-900 dark:text-white font-semibold mb-2">Email *</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                      className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-2 text-gray-900 dark:text-white text-base focus:outline-none focus:border-orange-500" 
                    />
                  </div>
                  <div className="w-80">
                    <label className="block text-gray-900 dark:text-white font-semibold mb-2">Téléphone *</label>
                    <input 
                      type="text" 
                      value={formData.phoneNumber}
                      onChange={e => setFormData(f => ({ ...f, phoneNumber: e.target.value }))}
                      className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-2 text-gray-900 dark:text-white text-base focus:outline-none focus:border-orange-500" 
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-x-6">
                  <div className="w-80">
                    <label className="block text-gray-900 dark:text-white font-semibold mb-2">Mot de passe</label>
                    <div className="relative">
                      <input
                        type={showPassword.edit ? 'text' : 'password'}
                        value={formData.password || ''}
                        onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
                        className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-2 text-gray-900 dark:text-white text-base focus:outline-none focus:border-orange-500 pr-12"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        tabIndex={-1}
                        onClick={() => setShowPassword((s) => ({ ...s, edit: !s.edit }))}
                        aria-label={showPassword.edit ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword.edit ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.233.938-4.675m1.675-2.325A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.233-.938-4.675m-1.675 2.325A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.336-3.233.938-4.675" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.4 4.6A9.956 9.956 0 0112 21c5.523 0 10-4.477 10-10 0-1.657-.336-3.233-.938-4.675" /></svg>
                        )}
                      </button>
                    </div>
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
              <div className="text-base text-gray-900 dark:text-white mb-2 font-semibold">{t('champsObligatoires')}</div>
              <div className="border-t border-gray-200 dark:border-gray-700 my-6" />
              <div className="text-2xl font-bold text-orange-600 mb-6 text-center">{t('modifierMotDePasse')}</div>
              <form className="flex flex-col gap-8 items-center" onSubmit={handlePasswordSubmit}>
                <div className="w-full max-w-2xl flex flex-row gap-6">
                  <div className="flex-1">
                    <label className="block text-gray-900 dark:text-white font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-2 text-gray-900 dark:text-white text-base focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-900 dark:text-white font-semibold mb-1">{t('motDePasseActuel')} *</label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-2 text-gray-900 dark:text-white text-base focus:outline-none focus:border-orange-500 pr-12"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        tabIndex={-1}
                        onClick={() => setShowPassword((s) => ({ ...s, current: !s.current }))}
                        aria-label={showPassword.current ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword.current ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.233.938-4.675m1.675-2.325A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.233-.938-4.675m-1.675 2.325A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.336-3.233.938-4.675" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.4 4.6A9.956 9.956 0 0112 21c5.523 0 10-4.477 10-10 0-1.657-.336-3.233-.938-4.675" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-2xl flex flex-row gap-6">
                  <div className="flex-1">
                    <label className="block text-gray-900 dark:text-white font-semibold mb-1">{t('nouveauMotDePasse')} *</label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-2 text-gray-900 dark:text-white text-base focus:outline-none focus:border-orange-500 pr-12"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        tabIndex={-1}
                        onClick={() => setShowPassword((s) => ({ ...s, new: !s.new }))}
                        aria-label={showPassword.new ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword.new ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.233.938-4.675m1.675-2.325A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.233-.938-4.675m-1.675 2.325A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.336-3.233.938-4.675" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.4 4.6A9.956 9.956 0 0112 21c5.523 0 10-4.477 10-10 0-1.657-.336-3.233-.938-4.675" /></svg>
                        )}
                      </button>
                    </div>
                    <ul className="mt-2 ml-2 text-xs space-y-1">
                      {passwordChecklist.map((item, idx) => (
                        <li key={idx} className={item.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}>
                          {item.test(passwordData.newPassword) ? '✔' : '✗'} {item.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-900 dark:text-white font-semibold mb-1">{t('confirmerMotDePasse')} *</label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-2 text-gray-900 dark:text-white text-base focus:outline-none focus:border-orange-500 pr-12"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        tabIndex={-1}
                        onClick={() => setShowPassword((s) => ({ ...s, confirm: !s.confirm }))}
                        aria-label={showPassword.confirm ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword.confirm ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.233.938-4.675m1.675-2.325A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0-1.657-.336-3.233-.938-4.675m-1.675 2.325A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.336-3.233.938-4.675" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.4 4.6A9.956 9.956 0 0112 21c5.523 0 10-4.477 10-10 0-1.657-.336-3.233-.938-4.675" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-8">
                  <button type="submit" className="bg-orange-500 text-white rounded-lg px-12 py-2 font-semibold text-base shadow-md hover:bg-orange-600 transition">
                    {t('modifierMotDePasse')}
                  </button>
                  <button type="button" onClick={() => setActiveTab('view')} className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg px-12 py-2 font-semibold text-base shadow-md hover:bg-gray-400 dark:hover:bg-gray-600 transition">
                    {t('annuler')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}