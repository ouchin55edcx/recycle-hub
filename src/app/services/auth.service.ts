import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signup(name: string, email: string, password: string) {
    const user = { name, email, password };
    localStorage.setItem('user', JSON.stringify(user));
  }

  login(email: string, password: string): boolean {
    const user = localStorage.getItem('user');
    if (!user) return false;

    const userData = JSON.parse(user);
    return userData.email === email && userData.password === password;
  }

  logout() {
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }
}
