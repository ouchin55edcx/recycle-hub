// src/app/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="bg-emerald-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-xl font-bold">RecycleHub</div>
        <div>
          <a href="#" class="mx-2 hover:text-emerald-200">Home</a>
          <a href="#" class="mx-2 hover:text-emerald-200">Login</a>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {}