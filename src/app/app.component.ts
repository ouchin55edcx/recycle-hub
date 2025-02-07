// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,        // Indique que ce composant est standalone
  imports: [RouterOutlet],  // Import de RouterOutlet pour que <router-outlet> soit reconnu
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RecycleHub';
}
