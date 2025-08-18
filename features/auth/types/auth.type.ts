// export enum UserType {
//   DEMANDEUR = 'DEMANDEUR',
//   PERSONNEL = 'PERSONNEL'
// }
//
// export enum UserStatus {
//   ACTIVE = 'ACTIVE',
//   INACTIVE = 'INACTIVE'

import { Role, UserStatus, UserType } from "@/features/demande/types/user.type";

// }
export interface ILoginResponse {
    user: IUser;
    accessToken: string;
    refreshToken: string;
}

export interface IRefreshTokenResponse {
    accessToken: string;
}

// export enum Role {
//   AGENT = 'AGENT',
//   CHEF_SERVICE = 'CHEF_SERVICE',
//   CONSUL = 'CONSUL',
//   ADMIN = 'ADMIN'
// }


export interface IUser {
    id: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    role?: Role;
    type: UserType;
    status: UserStatus;
}

export interface IUtilisateurAddUpdateResponse extends Pick<IUser,
    'email' | 'firstName' | 'lastName' | 'phoneNumber'> {
    password: string
}