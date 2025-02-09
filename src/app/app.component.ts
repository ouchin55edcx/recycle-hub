// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,        // Indique que ce composant est standalone
  imports: [RouterOutlet, ToastComponent],  // Import de RouterOutlet pour que <router-outlet> soit reconnu
  template: `
    <router-outlet></router-outlet>
    <app-toast></app-toast>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RecycleHub';
}
