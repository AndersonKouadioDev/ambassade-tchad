'use client';
import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {useSession} from 'next-auth/react';
import {useUtilisateurQuery} from "@/features/utilisateur/queries/utilisateur-detail.query";
import {revalidateLogic, useForm} from "@tanstack/react-form";
import {
    UtilisateurUpdateDTO,
    UtilisateurUpdateMotDePasseDTO,
    UtilisateurUpdateMotDePasseSchema,
    UtilisateurUpdateSchema
} from "@/features/utilisateur/schema/utilisateur.schema";
import {
    useModifierMotDePasseMutation,
    useModifierProfilMutation
} from "@/features/utilisateur/queries/utilisateur.mutation";
import {ProfilHeader} from "@/features/utilisateur/components/profil-header";
import {ProfilActions} from "@/features/utilisateur/components/profil-actions";
import {ProfilTabs} from "@/features/utilisateur/components/profil-tabs";
import {ProfilView} from "@/features/utilisateur/components/profil-view";
import {ProfilEdit} from "@/features/utilisateur/components/profil-edit";
import {ProfilPassword} from "@/features/utilisateur/components/profil-password";


export default function ProfilSection() {
    const t = useTranslations('espaceClient.profil');
    const {data: session} = useSession();
    const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'password'>('view');

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
        edit: false
    });

    const {data} = useUtilisateurQuery(session?.user.id);

    const {
        mutateAsync: updateProfil,
        isPending: updateProfilPending,
    } = useModifierProfilMutation();

    const {
        mutateAsync: updateMotDePasse,
        isPending: updateMotDePassePending,
    } = useModifierMotDePasseMutation();

    const {Field, handleSubmit} = useForm({
        defaultValues: {
            lastName: data?.lastName || '',
            firstName: data?.firstName || '',
            email: data?.email || '',
            phoneNumber: data?.phoneNumber || '',
        } as UtilisateurUpdateDTO,
        validationLogic: revalidateLogic({
            mode: "change",
        }),
        validators: {
            onChange: UtilisateurUpdateSchema,
        },
        onSubmit: async ({value}) => {
            await updateProfil({data: value, id: session?.user.id || ''});
        },
    });

    const {Field: PasswordField, handleSubmit: handlePasswordSubmit} = useForm({
        defaultValues: {
            password: '',
            newPassword: '',
            confirmNewPassword: '',
        } as UtilisateurUpdateMotDePasseDTO,
        validationLogic: revalidateLogic({
            mode: "change",
        }),
        validators: {
            onChange: UtilisateurUpdateMotDePasseSchema,
        },
        onSubmit: async ({value}) => {
            await updateMotDePasse({data: value, id: session?.user.id || ''});
        },
    });

    return (
        <div className="w-full">
            <div className="mx-auto">
                <ProfilHeader t={t}/>
                <div
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
                    <ProfilActions t={t} setActiveTab={setActiveTab}/>
                    <ProfilTabs t={t} activeTab={activeTab} setActiveTab={setActiveTab}/>

                    {activeTab === 'view' && <ProfilView t={t} data={data}/>}

                    {activeTab === 'edit' && (
                        <ProfilEdit
                            t={t}
                            handleSubmit={handleSubmit}
                            Field={Field}
                            setActiveTab={setActiveTab}
                        />
                    )}

                    {activeTab === 'password' && (
                        <ProfilPassword
                            t={t}
                            handlePasswordSubmit={handlePasswordSubmit}
                            PasswordField={PasswordField}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            setActiveTab={setActiveTab}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}