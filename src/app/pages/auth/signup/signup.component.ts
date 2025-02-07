// signup.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  onSignup() {
    console.log('Signup attempted', {
      name: this.name,
      email: this.email,
      password: this.password
    });
    // Add your signup logic here
  }
}