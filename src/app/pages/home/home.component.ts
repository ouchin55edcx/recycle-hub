import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center">
      <div class="max-w-4xl w-full mx-auto px-4 py-16 text-center">
        <!-- Hero Section -->
        <div class="mb-12 space-y-6">
          <h1 class="text-5xl md:text-6xl font-bold text-green-800 tracking-tight">
            Welcome to RecycleHub 
            <span class="inline-block animate-spin-slow">♻️</span>
          </h1>
          <p class="text-xl text-green-700 max-w-2xl mx-auto">
            Join our community and make a positive impact on the environment
          </p>
        </div>

        <!-- Auth Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a routerLink="/login" 
             class="px-8 py-3 text-lg font-semibold text-white bg-green-600 hover:bg-green-700 
                    rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 
                    transition duration-200 w-full sm:w-auto">
            Login
          </a>
          <a routerLink="/signup" 
             class="px-8 py-3 text-lg font-semibold text-green-700 bg-white hover:bg-green-50 
                    border-2 border-green-600 rounded-lg shadow-lg hover:shadow-xl 
                    transform hover:-translate-y-0.5 transition duration-200 w-full sm:w-auto">
            Register
          </a>
        </div>

        <!-- Environmental Impact Stats -->
        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200">
            <div class="text-green-600 text-3xl font-bold mb-2">1.2M+</div>
            <div class="text-gray-600">Items Recycled</div>
          </div>
          <div class="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200">
            <div class="text-green-600 text-3xl font-bold mb-2">50K+</div>
            <div class="text-gray-600">Active Members</div>
          </div>
          <div class="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200">
            <div class="text-green-600 text-3xl font-bold mb-2">500+</div>
            <div class="text-gray-600">Collection Points</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes spin-slow {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .animate-spin-slow {
      animation: spin-slow 8s linear infinite;
    }
  `]
})
export class HomeComponent {}