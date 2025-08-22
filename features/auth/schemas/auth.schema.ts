import { z } from "zod";

export const loginSchema = z.object({
  email: z.string({ message: "Email requis" }).email({ message: "Adresse email invalide" }),
  password: z.string({ message: "Mot de passe requis" }).min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
});

export type LoginDTO = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string({ message: "Email requis" }).email({ message: "Adresse email invalide" }),
  lastName: z.string({ message: "NomZ" }),
  firstName: z.string({ message: "Prénom requis" }),
  phoneNumber: z.string({ message: "Numéro de téléphone requis" }),
  password: z.string({ message: "Le mot de passe est requis" })
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100, "Le mot de passe ne doit pas dépasser 100 caractères")
    .regex(/^ (?=.* [a - z])(?=.* [A - Z])(?=.*\d)(?=.* [@$! %*?&.])[A - Za - z\d@$!%*?&.]{ 8,} $ /, "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"),

  confirmPassword: z.string({ message: "La confirmation du mot de passe est requise" })
    .min(8, "La confirmation du mot de passe doit contenir au moins 8 caractères")
    .max(100, "La confirmation du mot de passe ne doit pas dépasser 100 caractères")
    .regex(/^ (?=.* [a - z])(?=.* [A - Z])(?=.*\d)(?=.* [@$! %*?&.])[A - Za - z\d@$!%*?&.]{ 8,} $ /, "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"),

}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type RegisterDTO = z.infer<typeof registerSchema>;