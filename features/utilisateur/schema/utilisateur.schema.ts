import { z } from 'zod';

export const UtilisateurUpdateSchema = z.object({
    firstName: z.string({ message: "Le prénom est requis" })
        .min(2, "Le prénom doit contenir au moins 2 caractères")
        .max(100, "Le prénom ne doit pas dépasser 100 caractères")
        .trim(),

    lastName: z.string({ message: "Le nom est requis" })
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(100, "Le nom ne doit pas dépasser 100 caractères")
        .trim(),

    email: z.string({ message: "L'email est requis" })
        .email("L'email doit être une adresse valide")
        .max(100, "L'email ne doit pas dépasser 100 caractères")
        .toLowerCase()
        .trim(),

    phoneNumber: z.string({ message: "Le numéro de téléphone est requis" })
        .max(20, "Le numéro de téléphone ne doit pas dépasser 20 caractères")
        .regex(/^\+?[\d\s\-]+$/, "Numéro de téléphone invalide")
        .trim(),

    // Au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
    password: z.string({ message: "Le mot de passe est requis" })
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .max(100, "Le mot de passe ne doit pas dépasser 100 caractères")
        .regex(/^ (?=.* [a - z])(?=.* [A - Z])(?=.*\d)(?=.* [@$! %*?&.])[A - Za - z\d@$!%*?&.]{ 8,} $ /, "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"),
}).partial();
export const UtilisateurUpdateMotDePasseSchema = z.object({
    password: z.string({ message: "L'ancien mot de passe est requis" }),

    newPassword: z.string({ message: "Le nouveau mot de passe est requis" })
        .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
        .max(100, "Le nouveau mot de passe ne doit pas dépasser 100 caractères")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
            "Le nouveau mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
        ),

    confirmNewPassword: z.string({ message: "La confirmation du mot de passe est requise" })
        .min(8, "La confirmation du mot de passe doit contenir au moins 8 caractères")
        .max(100, "La confirmation du mot de passe ne doit pas dépasser 100 caractères")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
            "La confirmation du mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
        ),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmNewPassword"],
});



export type UtilisateurUpdateDTO = z.infer<typeof UtilisateurUpdateSchema>;

export type UtilisateurUpdateMotDePasseDTO = z.infer<typeof UtilisateurUpdateMotDePasseSchema>;

