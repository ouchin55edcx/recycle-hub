import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="dashboard">
      <nav>
        <a routerLink="/dashboard/profile">Profile</a>
        <a routerLink="/dashboard/collections">Collections</a>
        <button (click)="logout()">Logout</button>
      </nav>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .dashboard nav {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: #f0f0f0;
    }
  `]
})
export class DashboardComponent {
  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}