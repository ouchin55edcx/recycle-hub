import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  auth = inject(AuthService);
  router = inject(Router);
  
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

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.auth.deleteAccount(this.auth.currentUser?.id!).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }
}