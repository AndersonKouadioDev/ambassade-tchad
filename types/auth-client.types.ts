// src/types/auth.types.ts

export interface RegisterStep1 {
  firstName: string;
  lastName: string;
  email: string;
}

export interface RegisterStep2 {
  code: string; // ou 'otp' selon ton schéma
}

export interface RegisterStep3 {
  username: string;
  telephone: string; // après transformation
  password: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirm_password: string;
  username: string;
}

export interface NewPasswordPayload {
  token: string;
  newPassword: string;
  confirm_password: string;
}
