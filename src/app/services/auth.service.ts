import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, switchMap, of } from 'rxjs';
import { User } from '../models/user.model';
import { UserRole } from '../types/user.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  isParticulier(): boolean {
    return this.currentUser?.role === 'particulier';
  }

  isCollecteur(): boolean {
    return this.currentUser?.role === 'collecteur';
  }

  login(credentials: { email: string; password: string }) {
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${credentials.email}`).pipe(
      map(users => {
        const user = users[0];
        if (user && user.password === credentials.password) {
          this.currentUserSubject.next(user);
          return this.http.post<{ userId: string, token: string }>(`${this.apiUrl}/sessions`, {
            userId: user.id,
            token: this.generateToken(),
            createdAt: new Date().toISOString()
          }).pipe(
            map(() => user)
          );
        }
        throw new Error('Invalid email or password');
      })
    );
  }

  register(userData: Omit<User, 'id' | 'role' | 'registrationDate'>) {
    const newUser: Omit<User, 'id'> = {
      ...userData,
      role: 'particulier', // New users are always particuliers
      registrationDate: new Date().toISOString()
    };

    return this.http.post<User>(`${this.apiUrl}/users`, newUser).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): Observable<void> {
    const userId = this.currentUser?.id;
    if (!userId) {
      this.currentUserSubject.next(null);
      return new Observable(subscriber => {
        subscriber.next();
        subscriber.complete();
      });
    }

    // Remove session from db.json
    return this.http.delete<void>(`${this.apiUrl}/sessions?userId=${userId}`).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      })
    );
  }

  autoLogin(): Observable<void> {
    // Check for active session in db.json
    return this.http.get<any[]>(`${this.apiUrl}/sessions`).pipe(
      switchMap(sessions => {
        const validSession = sessions.find(session => {
          const createdAt = new Date(session.createdAt);
          const now = new Date();
          // Session valid for 24 hours
          return (now.getTime() - createdAt.getTime()) < 24 * 60 * 60 * 1000;
        });

        if (validSession) {
          return this.http.get<User>(`${this.apiUrl}/users/${validSession.userId}`).pipe(
            tap(user => {
              this.currentUserSubject.next(user);
            }),
            map(() => void 0) // Convert to void
          );
        }
        return of(void 0); // Return void observable if no valid session
      })
    );
  }

  updateUserProfile(userId: string, updates: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${userId}`, updates).pipe(
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  deleteAccount(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`).pipe(
      tap(() => {
        this.logout();
      })
    );
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${email}`).pipe(
      map(users => users.length > 0)
    );
  }

  sendVerificationEmail(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/verify-email`, { email });
  }

  verifyEmail(token: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/verify-email/confirm`, { token });
  }
}