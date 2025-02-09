// collector-process.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DemandService } from '../../../services/demand.service';
import { AuthService } from '../../../services/auth.service';
import { Demand } from '../../../models/demand.model';
import { ToastService } from '../../../services/toast.service';
import { DemandStatus } from '../../../types/demand.types';

@Component({
  selector: 'app-collector-process',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div class="container mx-auto px-4 py-8 max-w-7xl">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Collection Process</h2>
          <p class="mt-2 text-gray-600">Manage and process collection requests in your area</p>
        </div>

        <!-- Error Messages -->
        <div *ngIf="errorMessage" class="mb-6">
          <div class="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-md">
            {{ errorMessage }}
          </div>
        </div>

        <!-- Collection Verification Form (shows when a collection is in progress) -->
        <div *ngIf="selectedDemand && (selectedDemand.status === 'occupied' || selectedDemand.status === 'in_progress')"
             class="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 class="text-xl font-semibold mb-4">Verify Collection Details</h3>

          <form [formGroup]="verificationForm" (ngSubmit)="onVerificationSubmit()" class="space-y-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Actual Weight (grams)</label>
              <input
                type="number"
                formControlName="actualWeight"
                class="block w-full rounded-lg border-2 border-gray-300 px-4 py-3"
                placeholder="Enter actual weight"
              >
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Photos</label>
              <input
                type="file"
                (change)="onFileSelected($event)"
                multiple
                accept="image/*"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              >
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                formControlName="notes"
                rows="3"
                class="block w-full rounded-lg border-2 border-gray-300 px-4 py-3"
                placeholder="Any additional notes"
              ></textarea>
            </div>

            <div class="flex space-x-4">
              <button
                type="submit"
                class="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
              >
                Validate Collection
              </button>

              <button
                type="button"
                (click)="rejectDemand()"
                class="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
              >
                Reject Collection
              </button>
            </div>
          </form>
        </div>

        <!-- Available Collections List -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h3 class="text-xl font-semibold mb-4">Available Collections</h3>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let demand of availableDemands">
                <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getTypeClass(getFirstType(demand))">
                      {{ getFirstType(demand) }}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">{{ demand.weight }}g</td>
                <td class="px-6 py-4">{{ demand.address }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatusClass(demand.status)">
                      {{ demand.status }}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    *ngIf="demand.status === 'pending'"
                    (click)="acceptDemand(demand)"
                    class="text-green-600 hover:text-green-900 font-medium"
                  >
                    Accept
                  </button>
                  <button
                    *ngIf="demand.status === 'occupied' && demand.collectorId === currentUserId"
                    (click)="startCollection(demand)"
                    class="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    Start Collection
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CollectorProcessComponent implements OnInit {
  availableDemands: Demand[] = [];
  selectedDemand: Demand | null = null;
  errorMessage = '';
  currentUserId: string | null = null;
  uploadedPhotos: string[] = [];

  verificationForm = new FormGroup({
    actualWeight: new FormControl<number | null>(null, [Validators.required]),
    notes: new FormControl(''),
  });

  constructor(
    private demandService: DemandService,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.currentUser?.id?.toString() ?? null;
    this.loadAvailableDemands();
  }

  loadAvailableDemands(): void {
    const userCity = this.authService.currentUser?.address; // Supposé être une chaîne représentant la ville
    if (userCity) {
      this.demandService.getDemandsByCity(userCity).subscribe({
        next: (demands) => {
          this.availableDemands = demands;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load available demands';
          console.error(error);
        }
      });
    }
  }

  acceptDemand(demand: Demand): void {
    if (!this.currentUserId) return;

    const updates: Partial<Demand> = {
      status: 'in_progress',
      collectorId: this.currentUserId
    };

    this.demandService.updateDemand(demand.id, updates).subscribe({
      next: (updatedDemand) => {
        this.selectedDemand = updatedDemand;
        this.loadAvailableDemands();
        this.toast.showSuccess('Demand accepted successfully');
      },
      error: (error) => {
        this.toast.showError('Failed to accept demand');
        console.error(error);
      }
    });
  }

  startCollection(demand: Demand): void {
    if (demand.status === 'pending' || demand.status === 'occupied') {
      this.demandService.updateDemand(demand.id, { status: 'in_progress' }).subscribe({
        next: (updatedDemand) => {
          this.selectedDemand = updatedDemand;
          this.loadAvailableDemands();
        },
        error: (error) => {
          this.errorMessage = 'Failed to start collection';
          console.error(error);
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Pour cet exemple, on simule un upload et on génère des URL fictives.
      // Dans une application réelle, utilisez un service dédié pour l'upload des fichiers.
      const files = Array.from(input.files);
      files.forEach((file) => {
        const fakeUrl = `https://fakeupload.com/${Date.now()}_${file.name}`;
        this.uploadedPhotos.push(fakeUrl);
      });
    }
  }

  onVerificationSubmit(): void {
    if (!this.selectedDemand || !this.verificationForm.valid) return;

    // Demander la confirmation du type de matériau
    if (!confirm(`Confirm that the collected materials are: ${this.selectedDemand.types.join(', ')}`)) {
      return;
    }

    const formValue = this.verificationForm.value;
    this.demandService.updateDemand(this.selectedDemand.id, {
      status: 'validated',
      actualWeight: formValue.actualWeight ?? 0,
      photos: this.uploadedPhotos,
      // Convert null to undefined if necessary:
      notes: formValue.notes ?? undefined
    }).subscribe({
      next: () => {
        this.selectedDemand = null;
        this.verificationForm.reset();
        this.uploadedPhotos = [];
        this.loadAvailableDemands();
      },
      error: (error) => {
        this.errorMessage = 'Failed to validate collection';
        console.error(error);
      }
    });
  }


  rejectDemand(): void {
    if (!this.selectedDemand) return;

    const reason = prompt('Please provide a reason for rejection:');
    if (reason === null || reason.trim() === '') return;

    this.demandService.updateDemand(this.selectedDemand.id, {
      status: 'rejected',
      rejectionReason: reason
    }).subscribe({
      next: () => {
        this.selectedDemand = null;
        this.verificationForm.reset();
        this.uploadedPhotos = [];
        this.loadAvailableDemands();
      },
      error: (error) => {
        this.errorMessage = 'Failed to reject collection';
        console.error(error);
      }
    });
  }

  getTypeClass(type: string): string {
    const classes: { [key: string]: string } = {
      plastic: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800',
      glass: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800',
      paper: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800',
      metal: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800'
    };
    return classes[type] || '';
  }

  getStatusClass(status: DemandStatus): string {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      occupied: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      validated: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return classes[status] || '';
  }

  getFirstType(demand: Demand): string {
    return demand.types?.[0] || 'unknown';
  }

  canProcessDemand(selectedDemand: Demand | null): boolean {
    return !!selectedDemand && 
           (selectedDemand.status === 'in_progress' || 
            selectedDemand.status === 'occupied');
  }
}
