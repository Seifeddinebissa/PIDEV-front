export interface User {
    idUser?: number;
    firstName: string;
    lastName: string;
    cin: number;
    address: string;
    email: string;
    pwd?: string;
    roles: string[];
    isAdmin: boolean;
    isHR: boolean;
    isActive: boolean;
    photo?: string;
    dateOfBirth: Date;
} 