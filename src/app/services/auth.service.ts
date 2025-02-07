import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: { email: string; password: string }) {
    // Using GET with query params for JSON Server
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${credentials.email}`).pipe(
      map(users => {
        const user = users[0];
        if (user && user.password === credentials.password) {
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          return user;
        }
        throw new Error('Invalid email or password');
      })
    );
  }

  register(user: User) {
    return this.http.post<User>(`${this.apiUrl}/users`, user).pipe(
      tap(newUser => {
        // Optionally auto-login after registration
        this.currentUserSubject.next(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  updateUserProfile(userId: number, updates: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${userId}`, updates).pipe(
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      })
    );
  }

  autoLogin(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }
}