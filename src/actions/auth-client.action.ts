'use server';

import { cookies } from 'next/headers';
import { Method } from 'axios';

import { validateData } from '@/utils/formdata-zod.utilities';
import { ActionResult } from '@/types';
import { apiClientHttp } from '@/lib/api-client-http';
import {
    completeOtpSchema,
    registerClientSchema,
    resetPasswordSchema,
    loginSchema,
} from '../schemas/auth.schemas';

const authEndpoints: Record<string, { endpoint: string; method: Method }> = {
    register: { endpoint: '/auth/register-client', method: 'post' },
    login: { endpoint: '/auth/signin', method: 'post' },
    completeLogin: { endpoint: '/auth/complete-login', method: 'post' },
    requestPasswordResetOtp: { endpoint: '/auth/request-password-reset-otp', method: 'post' },
    resetPassword: { endpoint: '/auth/reset-password', method: 'post' },
    refresh: { endpoint: '/auth/demandeur/refresh', method: 'get' },
    profile: { endpoint: '/auth/demandeur/profile', method: 'get' },
};

// Utilitaire pour convertir FormData en objet
function formDataToObject(formData: FormData): Record<string, unknown> {
    const obj: Record<string, unknown> = {};
    formData.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
}

// Inscription
export async function registerClient(prevState: any, formData: FormData): Promise<ActionResult<any>> {
    const dataObj = formDataToObject(formData);
    const { success, data, errors } = validateData(registerClientSchema, dataObj);

    if (!success) {
        return {
            status: 'error',
            message: Object.values(errors ?? {})[0] || 'Erreur inconnue',
        };
    }

    try {
        await apiClientHttp.request({
            ...authEndpoints.register,
            data,
        });

        return { status: 'success', message: 'Inscription réussie' };
    } catch (error: any) {
        return {
            status: 'error',
            message: error?.response?.data?.detail || 'Erreur lors de l’inscription',
        };
    }
}

// Connexion
export async function login(prevState: any, formData: FormData): Promise<ActionResult<any>> {
    const dataObj = formDataToObject(formData);
    const { success, data, errors } = validateData(loginSchema, dataObj);

    if (!success) {
        return {
            status: 'error',
            message: Object.values(errors ?? {})[0] || 'Erreur inconnue',
        };
    }

    try {
        const response = await apiClientHttp.request({
            ...authEndpoints.login,
            data,
        });

        return { status: 'success', message: 'Connexion réussie', data: response };
    } catch (error: any) {
        return {
            status: 'error',
            message: error?.response?.data?.detail || 'Identifiants incorrects',
        };
    }
}

// Validation OTP
// export async function completeLogin(prevState: any, formData: FormData): Promise<ActionResult<any>> {
//     const dataObj = formDataToObject(formData);
//     const { success, data, errors } = validateData(completeOtpSchema, dataObj);
//
//     if (!success) {
//         return {
//             status: 'error',
//             message: Object.values(errors ?? {})[0] || 'Erreur inconnue',
//         };
//     }
//
//     try {
//         const response = await apiClientHttp.request({
//             ...authEndpoints.completeLogin,
//             data,
//         });
//
//         return { status: 'success', message: 'Connexion validée', data: response };
//     } catch (error: any) {
//         return {
//             status: 'error',
//             message: error?.response?.data?.detail || 'Erreur lors de la validation',
//         };
//     }
// }
//
// Demande OTP pour reset password
// export async function requestPasswordResetOtp(email: string): Promise<ActionResult<any>> {
//     try {
//         await apiClientHttp.request({
//             ...authEndpoints.requestPasswordResetOtp,
//             data: { email },
//         });
//
//         (await cookies()).set('email_otp', email);
//
//         return { status: 'success', message: 'Code envoyé' };
//     } catch (error: any) {
//         return {
//             status: 'error',
//             message: error?.response?.data?.detail || 'Erreur lors de la demande',
//         };
//     }
// }

// Réinitialisation du mot de passe
export async function resetPassword(prevState: any, formData: FormData): Promise<ActionResult<any>> {
    const dataObj = formDataToObject(formData);
    const { success, data, errors } = validateData(resetPasswordSchema, dataObj);

    if (!success) {
        return {
            status: 'error',
            message: Object.values(errors ?? {})[0] || 'Erreur inconnue',
        };
    }

    try {
        await apiClientHttp.request({
            ...authEndpoints.resetPassword,
            data,
        });

        return { status: 'success', message: 'Mot de passe réinitialisé' };
    } catch (error: any) {
        return {
            status: 'error',
            message: error?.response?.data?.detail || 'Erreur lors de la réinitialisation',
        };
    }
}

// Profil utilisateur
export async function getClientProfile() {
    try {
        return await apiClientHttp.request({
            ...authEndpoints.profile,
        });
    } catch (error: any) {
        throw new Error('Erreur lors de la récupération du profil');
    }
}

// Refresh Token
export async function refreshAccessToken() {
    try {
        return await apiClientHttp.request({
            ...authEndpoints.refresh,
        });
    } catch (error: any) {
        throw new Error('Erreur lors du refresh token');
    }
}
