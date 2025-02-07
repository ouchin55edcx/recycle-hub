import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="profile">
      <h2>Profile Settings</h2>
      <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
        <input formControlName="email" type="email" placeholder="Email">
        <input formControlName="phone" type="tel" placeholder="Phone">
        <textarea formControlName="address" placeholder="Address"></textarea>
        <button type="submit" [disabled]="!profileForm.valid">Update</button>
      </form>
    </div>
  `
})
export class ProfileComponent {
  auth = inject(AuthService);
  
  profileForm = new FormGroup({
    email: new FormControl(this.auth.currentUser?.email, [Validators.required, Validators.email]),
    phone: new FormControl(this.auth.currentUser?.phone, [
      Validators.required,
      Validators.pattern('[0-9]{10}')
    ]),
    address: new FormControl(this.auth.currentUser?.address, Validators.required)
  });

  updateProfile() {
    if (this.profileForm.valid && this.auth.currentUser) {
      const updates: Partial<User> = {
        email: this.profileForm.value.email!,
        phone: this.profileForm.value.phone!,
        address: this.profileForm.value.address!
      };

      this.auth.updateUserProfile(
        this.auth.currentUser.id!,
        updates
      ).subscribe({
        next: () => alert('Profile updated successfully!'),
        error: (err) => console.error('Update failed:', err)
      });
    }
  }
}