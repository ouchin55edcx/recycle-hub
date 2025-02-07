import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
      <div class="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="flex flex-col md:flex-row">
          <!-- Left Side - Progress and Image -->
          <div class="w-full md:w-1/3 bg-green-600 p-8 text-white">
            <div class="h-full flex flex-col">
              <h2 class="text-2xl font-bold mb-6">Join RecycleHub</h2>
              
              <!-- Progress Steps -->
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div [class]="'w-8 h-8 rounded-full flex items-center justify-center ' + 
                    (currentStep >= 1 ? 'bg-white text-green-600' : 'bg-green-500')">1</div>
                  <span>Account Details</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div [class]="'w-8 h-8 rounded-full flex items-center justify-center ' + 
                    (currentStep >= 2 ? 'bg-white text-green-600' : 'bg-green-500')">2</div>
                  <span>Personal Info</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div [class]="'w-8 h-8 rounded-full flex items-center justify-center ' + 
                    (currentStep >= 3 ? 'bg-white text-green-600' : 'bg-green-500')">3</div>
                  <span>Contact Details</span>
                </div>
              </div>

              <!-- Decorative Image -->
              <div class="mt-auto">
                <svg class="w-full max-w-[200px] mx-auto" viewBox="0 0 24 24" fill="white">
                  <path d="M21 9l-9-7-9 7v11h18v-11zm-2 9h-14v-7.81l7-5.45 7 5.45v7.81z"/>
                  <path d="M8 12h8v2h-8z"/>
                  <path d="M8 15h8v2h-8z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Right Side - Form -->
          <div class="w-full md:w-2/3 p-8">
            <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Step 1: Account Details -->
              <div *ngIf="currentStep === 1">
                <h3 class="text-2xl font-semibold mb-6">Create Your Account</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      formControlName="email"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 
                             focus:ring-green-500 focus:border-transparent transition"
                      placeholder="your@email.com"
                    />
                    <div *ngIf="signupForm.get('email')?.touched && signupForm.get('email')?.invalid"
                         class="text-red-500 text-sm mt-1">
                      Please enter a valid email
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      formControlName="password"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 
                             focus:ring-green-500 focus:border-transparent transition"
                      placeholder="••••••••"
                    />
                    <div *ngIf="signupForm.get('password')?.touched && signupForm.get('password')?.invalid"
                         class="text-red-500 text-sm mt-1">
                      Password must be at least 6 characters
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Personal Information -->
              <div *ngIf="currentStep === 2">
                <h3 class="text-2xl font-semibold mb-6">Personal Information</h3>
                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        formControlName="firstName"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 
                               focus:ring-green-500 focus:border-transparent transition"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        formControlName="lastName"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 
                               focus:ring-green-500 focus:border-transparent transition"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                    <input
                      type="date"
                      formControlName="birthDate"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 
                             focus:ring-green-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              <!-- Step 3: Contact Details -->
              <div *ngIf="currentStep === 3">
                <h3 class="text-2xl font-semibold mb-6">Contact Details</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      formControlName="phone"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 
                             focus:ring-green-500 focus:border-transparent transition"
                      placeholder="(123) 456-7890"
                    />
                    <div *ngIf="signupForm.get('phone')?.touched && signupForm.get('phone')?.invalid"
                         class="text-red-500 text-sm mt-1">
                      Please enter a valid phone number
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      formControlName="address"
                      rows="3"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 
                             focus:ring-green-500 focus:border-transparent transition"
                      placeholder="Enter your full address"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex justify-between pt-6">
                <button
                  type="button"
                  *ngIf="currentStep > 1"
                  (click)="previousStep()"
                  class="px-6 py-2 text-green-600 border-2 border-green-600 rounded-lg 
                         hover:bg-green-50 transition">
                  Back
                </button>
                <button
                  type="button"
                  *ngIf="currentStep < 3"
                  (click)="nextStep()"
                  [disabled]="!isStepValid()"
                  class="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                         transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
                <button
                  type="submit"
                  *ngIf="currentStep === 3"
                  [disabled]="!signupForm.valid"
                  class="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                         transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Complete Registration
                </button>
              </div>

              <!-- Login Link -->
              <div class="text-center mt-6">
                <a routerLink="/login" class="text-green-600 hover:text-green-800 text-sm font-medium">
                  Already have an account? <span class="underline">Login</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  currentStep = 1;

  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    birthDate: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
    address: new FormControl('', Validators.required),
  });

  constructor(private auth: AuthService, private router: Router) {}

  isStepValid(): boolean {
    if (this.currentStep === 1) {
      const emailValid = this.signupForm.get('email')?.valid ?? false;
      const passwordValid = this.signupForm.get('password')?.valid ?? false;
      return emailValid && passwordValid;
    } else if (this.currentStep === 2) {
      const firstNameValid = this.signupForm.get('firstName')?.valid ?? false;
      const lastNameValid = this.signupForm.get('lastName')?.valid ?? false;
      const birthDateValid = this.signupForm.get('birthDate')?.valid ?? false;
      return firstNameValid && lastNameValid && birthDateValid;
    }
    return true;
  }


  nextStep() {
    if (this.isStepValid() && this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formValue = this.signupForm.value;

      const userData: User = {
        email: formValue.email!,
        password: formValue.password!,
        firstName: formValue.firstName!,
        lastName: formValue.lastName!,
        birthDate: formValue.birthDate!,
        phone: formValue.phone!,
        address: formValue.address!,
        role: 'user',
        registrationDate: new Date().toISOString(),
      };

      this.auth.register(userData).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => console.error('Registration failed:', err),
      });
    }
  }
}