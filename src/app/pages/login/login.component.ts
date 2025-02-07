import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, HttpClientModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center px-4 py-12">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <!-- Header -->
        <div class="text-center">
          <h2 class="text-3xl font-bold text-green-800 mb-2">Welcome Back! 👋</h2>
          <p class="text-gray-600">Login to your RecycleHub account</p>
        </div>

        <!-- Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div class="space-y-4">
            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 
                       focus:border-transparent outline-none transition duration-200
                       placeholder:text-gray-400"
                placeholder="your@email.com"
              />
              <div *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid"
                   class="text-red-500 text-sm mt-1">
                Please enter a valid email
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 
                       focus:border-transparent outline-none transition duration-200
                       placeholder:text-gray-400"
                placeholder="••••••••"
              />
              <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid"
                   class="text-red-500 text-sm mt-1">
                Password is required
              </div>
            </div>
          </div>

          <!-- Forgot Password Link -->
          <div class="flex items-center justify-end">
            <a routerLink="/forgot-password" class="text-sm text-green-600 hover:text-green-800">
              Forgot your password?
            </a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="!loginForm.valid"
            class="w-full px-4 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg
                   font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 
                   transition duration-200 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed">
            Sign In
          </button>

          <!-- Register Link -->
          <div class="text-center mt-4">
            <a routerLink="/signup" 
               class="text-green-600 hover:text-green-800 text-sm font-medium">
              Don't have an account? 
              <span class="underline">Register now</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      this.auth.login(credentials).subscribe({
        next: () => this.router.navigate(['/dashboard']), 
        error: (err) => console.error('Login failed:', err)
      });
    }
  }
}