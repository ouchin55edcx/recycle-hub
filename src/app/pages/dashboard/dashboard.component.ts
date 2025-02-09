import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink],
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
              <a
                routerLink="/dashboard/collections"
                class="text-green-700 hover:text-green-900 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                routerLinkActive="bg-green-100 text-green-900"
              >
                Collections
              </a>

              <a
                routerLink="/dashboard/collector-process"
                class="text-green-700 hover:text-green-900 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                routerLinkActive="bg-green-100 text-green-900"
              >
                Collector Process
              </a>
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
  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}
