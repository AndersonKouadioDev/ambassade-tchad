export enum Role {
    AGENT = 'AGENT',
    CHEF_SERVICE = 'CHEF_SERVICE',
    CONSUL = 'CONSUL',
    ADMIN = 'ADMIN'
}

export enum UserType {
    DEMANDEUR = 'DEMANDEUR',
    PERSONNEL = 'PERSONNEL'
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export interface IUser {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    role?: Role;
    type: UserType;
    status: UserStatus;
    
}