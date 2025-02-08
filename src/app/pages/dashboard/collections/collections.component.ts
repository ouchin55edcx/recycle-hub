import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DemandService } from '../../../services/demand.service';
import { AuthService } from '../../../services/auth.service';
import { Demand } from '../../../models/demand.model';

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
  activeView: 'form' | 'list' = 'form'; // Added activeView property

  collectionForm = new FormGroup({
    type: new FormControl<string | null>('plastic', Validators.required),
    weight: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1000),
      Validators.max(10000)
    ]),
    address: new FormControl<string | null>('', Validators.required),
    collectionTime: new FormControl<string | null>('', [Validators.required]),
    collectionDate: new FormControl<string | null>('', [Validators.required]),
    notes: new FormControl<string | null>(''),
    photos: new FormControl<File[]>([])
  });

  constructor(
    private demandService: DemandService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    const userId = this.authService.currentUser?.id;
    if (userId) {
      this.demandService.getUserDemands(userId).subscribe({
        next: (data) => {
          this.collections = data;
          this.pendingRequests = data.filter(d => d.status === 'pending').length;
          // Automatically switch to list view after successful submission
          if (this.collections.length > 0) {
            this.activeView = 'list';
          }
        },
        error: (error) => {
          this.errorMessage = 'Failed to load collections';
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
    if (!this.authService.currentUser || !this.authService.currentUser.id) {
      this.errorMessage = 'Please login to submit a request';
      return;
    }

    if (this.collectionForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    if (this.pendingRequests >= 3) {
      this.errorMessage = 'Maximum number of pending requests (3) reached';
      return;
    }

    const userId: number = this.authService.currentUser.id;
    const formValues = this.collectionForm.value;

    const newDemand: Omit<Demand, 'id'> = {
      type: formValues.type as 'plastic' | 'glass' | 'paper' | 'metal',
      weight: formValues.weight ?? 0,
      address: formValues.address ?? '',
      status: 'pending',
      requestDate: formValues.collectionDate ?? new Date().toISOString(),
      collectionTime: formValues.collectionTime ?? '09:00',
      notes: formValues.notes ?? '',
      userId: userId
    };

    this.demandService.createDemand(newDemand).subscribe({
      next: () => {
        this.loadCollections();
        this.collectionForm.reset();
        this.selectedFile = null;
        this.errorMessage = '';
        // Switch to list view after successful submission
        this.activeView = 'list';
      },
      error: (error) => {
        this.errorMessage = 'Failed to create collection request';
        console.error(error);
      }
    });
  }

  deleteCollection(id: number | undefined): void {
    if (id === undefined) {
      this.errorMessage = 'Cannot delete collection: Invalid ID';
      return;
    }

    if (confirm('Are you sure you want to delete this collection request?')) {
      this.demandService.deleteDemand(id).subscribe({
        next: () => {
          this.loadCollections();
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete collection';
          console.error(error);
        }
      });
    }
  }

  editCollection(collection: Demand): void {
    this.collectionForm.patchValue({
      type: collection.type ?? null,
      weight: collection.weight ?? null,
      address: collection.address ?? null,
      collectionTime: collection.collectionTime ?? null,
      collectionDate: collection.requestDate ?? null,
      notes: collection.notes ?? null
    });
    // Switch to form view when editing
    this.activeView = 'form';
  }

  // Helper method to format date to YYYY-MM-DD
  formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  // Enhanced getStatusClass method with more detailed styling
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

  // Helper method to get type-specific styling
  getTypeClass(type: string): string {
    const classes = {
      plastic: 'bg-purple-100 text-purple-800 border border-purple-200',
      glass: 'bg-blue-100 text-blue-800 border border-blue-200',
      paper: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      metal: 'bg-gray-100 text-gray-800 border border-gray-200'
    };
    return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800 border border-gray-200';
  }
}
