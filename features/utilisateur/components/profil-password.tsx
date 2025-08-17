import {SetActiveTabType, SetShowPassword, TanstackField, TFunction} from "@/features/utilisateur/types";
import {PasswordInput} from "@/features/utilisateur/components/password-input";

export const ProfilPassword = ({t, handlePasswordSubmit, PasswordField, showPassword, setShowPassword, setActiveTab}: {
    t: TFunction;
    handlePasswordSubmit: () => void;
    PasswordField: TanstackField;
    showPassword: { current: boolean; new: boolean; confirm: boolean; edit: boolean };
    setShowPassword: SetShowPassword;
    setActiveTab: SetActiveTabType;
}) => (
    <div>
        <div className="text-base text-gray-900 dark:text-white mb-2 font-semibold">{t('champsObligatoires')}</div>
        <div className="border-t border-gray-200 dark:border-gray-700 my-6"/>
        <div className="text-2xl font-bold text-orange-600 mb-6 text-center">{t('modifierMotDePasse')}</div>
        <form className="flex flex-col gap-8 items-center" onSubmit={(e) => {
            e.preventDefault();
            handlePasswordSubmit();
        }}>
            <div className="w-full max-w-2xl flex flex-row gap-6">
                <div className="flex-1">
                    <label
                        className="block text-gray-900 dark:text-white font-semibold mb-1">{t('motDePasseActuel')} *</label>
                    <PasswordField name="password">
                        {(field) => (
                            <PasswordInput
                                field={field}
                                showPassword={showPassword.current}
                                togglePassword={() => setShowPassword((s) => ({...s, current: !s.current}))}
                            />
                        )}
                    </PasswordField>
                </div>
            </div>
            <div className="w-full max-w-2xl flex flex-row gap-6">
                <div className="flex-1">
                    <label
                        className="block text-gray-900 dark:text-white font-semibold mb-1">{t('nouveauMotDePasse')} *</label>
                    <PasswordField name="newPassword">
                        {(field) => (
                            <PasswordInput
                                field={field}
                                showPassword={showPassword.new}
                                togglePassword={() => setShowPassword((s) => ({...s, new: !s.new}))}
                            />
                        )}
                    </PasswordField>
                </div>
                <div className="flex-1">
                    <label
                        className="block text-gray-900 dark:text-white font-semibold mb-1">{t('confirmerMotDePasse')} *</label>
                    <PasswordField name="confirmNewPassword">
                        {(field) => (
                            <PasswordInput
                                field={field}
                                showPassword={showPassword.confirm}
                                togglePassword={() => setShowPassword((s) => ({...s, confirm: !s.confirm}))}
                            />
                        )}
                    </PasswordField>
                </div>
            </div>
            <div className="flex justify-center gap-4 mt-8">
                <button type="submit"
                        className="bg-orange-500 text-white rounded-lg px-12 py-2 font-semibold text-base shadow-md hover:bg-orange-600 transition">
                    {t('modifierMotDePasse')}
                </button>
                <button type="button" onClick={() => setActiveTab('view')}
                        className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg px-12 py-2 font-semibold text-base shadow-md hover:bg-gray-400 dark:hover:bg-gray-600 transition">
                    {t('annuler')}
                </button>
            </div>
        </form>
    </div>
);