import { UserRole } from '../types/user.types';

export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    phone: string;
    address: string;
    role: UserRole;
    registrationDate: string;
    profilePhoto?: string;
    points?: number;
  }

export type CreateUserDto = Omit<User, 'id' | 'role' | 'registrationDate'>;