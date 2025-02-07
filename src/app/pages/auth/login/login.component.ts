import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../components/navbar/navbar.component'; // Import Navbar
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NavbarComponent, CommonModule], // Add NavbarComponent
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  // Add onLogin method
  onLogin() {
    console.log('Login attempted', {
      email: this.email,
      password: this.password
    });
    // Add your login logic here
  }
}