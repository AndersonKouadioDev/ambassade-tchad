import {tanstackFieldApi} from "@/features/utilisateur/types";
import {ErrorMessage} from "@/features/utilisateur/components/error-message";

export const PasswordInput = ({field, showPassword, togglePassword}: {
    field: tanstackFieldApi,
    showPassword: boolean,
    togglePassword: () => void
}) => (
    <div className="relative">
        <input
            type={showPassword ? 'text' : 'password'}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            className="w-full rounded-full border border-gray-300  bg-white  px-6 py-2 text-gray-900  text-base focus:outline-none focus:border-orange-500 pr-12"
        />
        <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            tabIndex={-1}
            onClick={togglePassword}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
            {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.233.938-4.675m1.675-2.325A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0-1.657-.336-3.233-.938-4.675m-1.675 2.325A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.336-3.233.938-4.675"/>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.4 4.6A9.956 9.956 0 0112 21c5.523 0 10-4.477 10-10 0-1.657-.336-3.233-.938-4.675"/>
                </svg>
            )}
        </button>
        {field.state.meta.errors[0] && (
            <ErrorMessage message={field.state.meta.errors[0].message}/>
        )}
    </div>
);