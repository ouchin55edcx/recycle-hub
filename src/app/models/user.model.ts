export interface User {
    id?: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    phone: string;
    address: string;
    role: 'user' | 'collector';
    registrationDate: string;
    profilePhoto?: string;
    points?: number;
  }