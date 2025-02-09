import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DemandService } from '../../../services/demand.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { Demand } from '../../../models/demand.model';
import { MaterialType } from '../../../types/demand.types';
import { CreateDemandDto } from '../../../models/demand.model';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {
  collections: Demand[] = [];
  pendingRequests = 0;
  errorMessage = '';
  selectedFile: File | null = null;
  activeView: 'form' | 'list' = 'form';
  isEditing = false;
  editingId: string | null = null;

  collectionForm = new FormGroup({
    type: new FormControl<MaterialType>('plastic', [Validators.required]),
    weight: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1000),  // Minimum 1kg
      Validators.max(10000)  // Maximum 10kg
    ]),
    address: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(10)  // Ensure address is detailed enough
    ]),
    collectionTime: new FormControl<string>('', [
      Validators.required,
      this.timeValidator()  // Custom validator for business hours
    ]),
    collectionDate: new FormControl<string>('', [
      Validators.required,
      this.futureDateValidator()  // Custom validator for future dates
    ]),
    notes: new FormControl<string>(''),
    photos: new FormControl<File[]>([])
  });

  constructor(
    private demandService: DemandService,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    const userId = this.authService.currentUser?.id;
    if (userId) {
      this.demandService.getUserDemands(userId.toString()).subscribe({
        next: (data) => {
          this.collections = data;
          this.pendingRequests = data.filter(d => d.status === 'pending').length;
          if (this.collections.length > 0) {
            this.activeView = 'list';
          }
        },
        error: (error) => {
          this.toast.showError('Failed to load collections');
          console.error(error);
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.authService.currentUser?.id) {
      this.toast.showError('Please login to submit a request');
      return;
    }

    if (this.collectionForm.invalid) {
      this.toast.showError('Please fill all required fields correctly');
      return;
    }

    const formValues = this.collectionForm.value;
    const demandData: CreateDemandDto = {
      types: [formValues.type as MaterialType],
      weight: formValues.weight ?? 0,
      address: formValues.address ?? '',
      requestDate: formValues.collectionDate ?? new Date().toISOString(),
      collectionTime: formValues.collectionTime ?? '09:00',
      notes: formValues.notes ?? '',
      userId: this.authService.currentUser.id.toString()
    };

    if (this.isEditing && this.editingId) {
      this.demandService.updateDemand(this.editingId, demandData).subscribe({
        next: () => {
          this.loadCollections();
          this.resetForm();
          this.toast.showSuccess('Collection updated successfully');
        },
        error: (error) => {
          this.toast.showError('Failed to update collection');
          console.error(error);
        }
      });
    } else {
      if (this.pendingRequests >= 3) {
        this.errorMessage = 'Maximum number of pending requests (3) reached';
        return;
      }

      this.demandService.createDemand(demandData).subscribe({
        next: () => {
          this.toast.showSuccess('Collection created successfully');
          this.loadCollections();
          this.resetForm();
        },
        error: (error) => {
          this.toast.showError('Failed to create collection request');
          console.error(error);
        }
      });
    }
  }

  deleteCollection(id: string | undefined): void {
    if (!id) {
      this.toast.showError('Invalid collection ID');
      return;
    }

    if (confirm('Are you sure?')) {
      this.demandService.deleteDemand(id).subscribe({
        next: () => {
          this.toast.showSuccess('Collection deleted successfully');
          this.loadCollections();
        },
        error: () => this.toast.showError('Failed to delete collection')
      });
    }
  }

  editCollection(collection: Demand): void {
    this.isEditing = true;
    this.editingId = collection.id?.toString() ?? null;
    
    this.collectionForm.patchValue({
      type: collection.types?.[0] ?? 'plastic',
      weight: collection.weight ?? null,
      address: collection.address ?? '',
      collectionTime: collection.collectionTime ?? '09:00',
      collectionDate: this.formatDate(collection.requestDate) ?? this.formatDate(new Date().toISOString()),
      notes: collection.notes ?? ''
    });
    this.activeView = 'form';
  }

  formatDate(date: string | undefined): string {
    if (!date) return new Date().toISOString().split('T')[0];
    return new Date(date).toISOString().split('T')[0];
  }

  getStatusClass(status: string): string {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      approved: 'bg-green-100 text-green-800 border border-green-200',
      rejected: 'bg-red-100 text-red-800 border border-red-200',
      completed: 'bg-blue-100 text-blue-800 border border-blue-200',
      cancelled: 'bg-gray-100 text-gray-800 border border-gray-200'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800 border border-gray-200';
  }

  getTypeClass(type: string | undefined): string {
    if (!type) return '';
    
    const classes = {
      plastic: 'bg-purple-100 text-purple-800 border border-purple-200',
      glass: 'bg-blue-100 text-blue-800 border border-blue-200',
      paper: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      metal: 'bg-gray-100 text-gray-800 border border-gray-200',
      unknown: 'bg-gray-100 text-gray-800 border border-gray-200'
    };
    return classes[type as keyof typeof classes] || classes.unknown;
  }

  getFirstType(collection: Demand): string {
    return collection.types?.[0] || 'unknown';
  }

  private timeValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const time = control.value;
      const hour = parseInt(time.split(':')[0]);
      return (hour >= 9 && hour < 18) ? null : { timeOutOfBounds: true };
    };
  }

  private futureDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const selected = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today ? null : { pastDate: true };
    };
  }

  getWeightError(): string {
    const control = this.collectionForm.get('weight');
    if (control?.errors) {
      if (control.errors['required']) return 'Weight is required';
      if (control.errors['min']) return 'Minimum weight is 1kg (1000g)';
      if (control.errors['max']) return 'Maximum weight is 10kg (10000g)';
    }
    return '';
  }

  getAddressError(): string {
    const control = this.collectionForm.get('address');
    if (control?.errors) {
      if (control.errors['required']) return 'Address is required';
      if (control.errors['minlength']) return 'Please enter a more detailed address';
    }
    return '';
  }

  getTimeError(): string {
    const control = this.collectionForm.get('collectionTime');
    if (control?.errors?.['timeOutOfBounds']) {
      return 'Collection time must be between 9:00 and 18:00';
    }
    return '';
  }

  getDateError(): string {
    const control = this.collectionForm.get('collectionDate');
    if (control?.errors?.['pastDate']) {
      return 'Collection date cannot be in the past';
    }
    return '';
  }

  getStatusBadgeClass(status: string): string {
    return {
      'pending': 'bg-yellow-100 text-yellow-800',
      'occupied': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-purple-100 text-purple-800',
      'validated': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    }[status] || 'bg-gray-100 text-gray-800';
  }

  private resetForm(): void {
    this.collectionForm.reset({
      type: 'plastic',
      weight: null,
      address: '',
      collectionTime: '',
      collectionDate: '',
      notes: ''
    });
    this.isEditing = false;
    this.editingId = null;
    this.selectedFile = null;
    this.errorMessage = '';
    this.activeView = 'list';
  }

  createNewCollection(): void {
    this.resetForm();
    this.activeView = 'form';
  }
}
