import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: { email: string; password: string }) {
    return this.http.get<User[]>(`/users?email=${credentials.email}&password=${credentials.password}`);
  }
  
  register(user: User) {
    return this.http.post<User>('/users', user);
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  updateUserProfile(userId: number, updates: Partial<User>): Observable<User> {
    return this.http.patch<User>(`/users/${userId}`, updates).pipe(
      tap(updatedUser => this.currentUserSubject.next(updatedUser))
    );
  }

  autoLogin(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }
}