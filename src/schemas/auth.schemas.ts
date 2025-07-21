import { z } from "zod";

// --- Register Schema ---
export const registerClientSchema = z.object({
  firstName: z.string().min(1, "Prénom requis").max(100),
  lastName: z.string().min(1, "Nom requis").max(100),
  email: z.string().email("Email invalide").max(100),
  phoneNumber: z
    .string()
    .min(1, "Téléphone requis")
    .max(20)
    .regex(/^\+225\d{8,}$/, "Format: +225XXXXXXXXX"),
  password: z
    .string()
    .min(8, "Min. 8 caractères")
    .max(15, "Max. 15 caractères")
    .regex(/(?=.*[A-Z])/, "Une majuscule requise")
    .regex(/(?=.*\d)/, "Un chiffre requis")
    .regex(/(?=.*[!@#$%^&*])/, "Un caractère spécial requis"),
});
export type RegisterClientSchema = z.infer<typeof registerClientSchema>;

// --- Login Schema ---
export const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "L'email est obligatoire." })
    .email({ message: "L'email doit être une adresse email valide." })
    .max(100, { message: "L'email ne doit pas dépasser 100 caractères." }),

  password: z
    .string()
    .nonempty({ message: "Le mot de passe est obligatoire." })
    .max(15, { message: "Le mot de passe ne doit pas dépasser 15 caractères." })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;':"\\,.<>\/?]).{8,}$/,
      {
        message:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.",
      }
    ),
});
export type LoginSchema = z.infer<typeof loginSchema>;

// --- Change Password Schema ---
export const changePasswordSchema = z.object({
  username: z.string(),
  oldPassword: z.string(),
  newPassword: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, un symbole et un chiffre."
    ),
  confirm_password: z.string(),
});
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

// --- New Password Schema ---
export const newPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string(),
  confirm_password: z.string(),
});
export type NewPasswordSchema = z.infer<typeof newPasswordSchema>;

// --- Complete OTP Schema ---
// export const completeOtpSchema = z.object({
//   email: z.string().email("Email invalide"),
//   otp: z.string().length(6, "Le code OTP doit contenir 6 chiffres"),
// });
// export type CompleteOtpSchema = z.infer<typeof completeOtpSchema>;

// --- Reset Password Schema ---
export const resetPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
  otp: z.string(),
  password: z
    .string()
    .min(8)
    .max(15)
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;':".,<>?/\\]).+$/,
      "Mot de passe non conforme."
    ),
});
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
