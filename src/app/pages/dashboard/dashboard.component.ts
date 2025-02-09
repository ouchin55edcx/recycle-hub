import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <!-- Navigation Bar -->
      <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Left Side Links -->
            <div class="flex space-x-8">
              <a
                routerLink="/dashboard/profile"
                class="text-green-700 hover:text-green-900 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                routerLinkActive="bg-green-100 text-green-900"
              >
                Profile
              </a>

              <!-- Links for Particulier -->
              <ng-container *ngIf="auth.isParticulier()">
                <a
                  routerLink="/dashboard/collections"
                  class="text-green-700 hover:text-green-900 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                  routerLinkActive="bg-green-100 text-green-900"
                >
                  Collections
                </a>

                <a
                  routerLink="/dashboard/points"
                  routerLinkActive="border-b-2 border-green-500"
                  class="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-gray-900"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Points & Rewards
                </a>
              </ng-container>

              <!-- Links for Collecteur -->
              <ng-container *ngIf="auth.isCollecteur()">
                <a
                  routerLink="/dashboard/collector-process"
                  class="text-green-700 hover:text-green-900 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                  routerLinkActive="bg-green-100 text-green-900"
                >
                  Validate Collections
                </a>
              </ng-container>
            </div>

            <!-- Logout Button -->
            <button
              (click)="logout()"
              class="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="p-8">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        // Still navigate to login in case of error
        this.router.navigate(['/login']);
      }
    });
  }
}
