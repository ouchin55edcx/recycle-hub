import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DemandService } from '../../../services/demand.service';
import { ToastService } from '../../../services/toast.service';
import { Demand } from '../../../models/demand.model';
import { DemandStatus } from '../../../types/demand.types';

@Component({
  selector: 'app-collection-processing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Collection Processing</h2>
        
        <!-- Processing Form -->
        <form *ngIf="selectedDemand" [formGroup]="processingForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Weight Verification -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Actual Weight (g)</label>
            <input type="number" formControlName="actualWeight" class="form-input rounded-md w-full"/>
            <div *ngIf="weightDifference" [class]="getWeightDifferenceClass()">
              Weight Difference: {{ weightDifference }}g 
              ({{ weightDifferencePercentage }}%)
            </div>
          </div>

          <!-- Material Verification -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Material Verification</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="checkbox" formControlName="materialVerified" class="form-checkbox"/>
                <span class="ml-2">Materials Match Declaration</span>
              </label>
            </div>
          </div>

          <!-- Sorting Validation -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Sorting Validation</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="checkbox" formControlName="sortingCorrect" class="form-checkbox"/>
                <span class="ml-2">Properly Sorted</span>
              </label>
            </div>
          </div>

          <!-- Photo Upload -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Verification Photos</label>
            <input type="file" multiple (change)="onFileSelected($event)" 
                   accept="image/*" class="form-input"/>
            <div class="grid grid-cols-3 gap-4 mt-2">
              <div *ngFor="let photo of selectedPhotos" class="relative">
                <img [src]="photo.preview" class="w-full h-32 object-cover rounded"/>
                <button type="button" (click)="removePhoto(photo)" 
                        class="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Verification Notes</label>
            <textarea formControlName="verificationNotes" rows="3" 
                      class="form-textarea rounded-md w-full"></textarea>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <button type="submit" 
                    [disabled]="processingForm.invalid || isSubmitting"
                    class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700
                           disabled:opacity-50 disabled:cursor-not-allowed">
              Complete Processing
            </button>
          </div>
        </form>

        <!-- Collection History -->
        <div *ngIf="!selectedDemand" class="space-y-4">
          <div *ngFor="let demand of processedDemands" 
               class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
               (click)="selectDemand(demand)">
            <div class="flex justify-between items-center">
              <div>
                <span class="font-medium">ID: {{ demand.id }}</span>
                <span class="ml-4 text-gray-600">{{ demand.requestDate }}</span>
              </div>
              <span [class]="getStatusClass(demand.status)">
                {{ demand.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CollectionProcessingComponent implements OnInit {
  selectedDemand: Demand | null = null;
  processedDemands: Demand[] = [];
  processingForm: FormGroup;
  isSubmitting = false;
  selectedPhotos: { file: File; preview: string }[] = [];
  weightDifference: number = 0;
  weightDifferencePercentage: number = 0;

  constructor(
    private fb: FormBuilder,
    private demandService: DemandService,
    private toast: ToastService
  ) {
    this.processingForm = this.fb.group({
      actualWeight: ['', [Validators.required, Validators.min(0)]],
      materialVerified: [false, Validators.required],
      sortingCorrect: [false, Validators.required],
      verificationNotes: ['']
    });
  }

  ngOnInit() {
    this.loadProcessedDemands();
  }

  loadProcessedDemands() {
    // Load demands that are in_progress or completed
    this.demandService.getProcessingDemands().subscribe({
      next: (demands) => {
        this.processedDemands = demands;
      },
      error: (error) => {
        this.toast.showError('Failed to load demands');
        console.error(error);
      }
    });
  }

  selectDemand(demand: Demand) {
    this.selectedDemand = demand;
    this.processingForm.patchValue({
      actualWeight: demand.actualWeight || demand.weight,
      materialVerified: demand.verificationDetails?.materialVerified || false,
      sortingCorrect: demand.verificationDetails?.sortingCorrect || false,
      verificationNotes: demand.verificationDetails?.verificationNotes || ''
    });
    this.calculateWeightDifference();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedPhotos.push({
            file,
            preview: e.target?.result as string
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removePhoto(photo: { file: File; preview: string }) {
    const index = this.selectedPhotos.indexOf(photo);
    if (index > -1) {
      this.selectedPhotos.splice(index, 1);
    }
  }

  calculateWeightDifference() {
    if (this.selectedDemand && this.processingForm.get('actualWeight')?.value) {
      const actualWeight = this.processingForm.get('actualWeight')?.value;
      this.weightDifference = actualWeight - this.selectedDemand.weight;
      this.weightDifferencePercentage = Math.round((this.weightDifference / this.selectedDemand.weight) * 100);
    }
  }

  getWeightDifferenceClass(): string {
    if (Math.abs(this.weightDifferencePercentage) <= 5) {
      return 'text-green-600';
    } else if (Math.abs(this.weightDifferencePercentage) <= 10) {
      return 'text-yellow-600';
    }
    return 'text-red-600';
  }

  async onSubmit() {
    if (this.processingForm.invalid || !this.selectedDemand) return;

    this.isSubmitting = true;
    const formValue = this.processingForm.value;

    // Upload photos first
    const photoUrls = await this.uploadPhotos();

    const updates: Partial<Demand> = {
      status: 'validated',
      actualWeight: formValue.actualWeight,
      verificationDetails: {
        weightDifference: this.weightDifference,
        materialVerified: formValue.materialVerified,
        sortingCorrect: formValue.sortingCorrect,
        verificationNotes: formValue.verificationNotes,
        verificationDate: new Date().toISOString(),
        verificationPhotos: photoUrls
      },
      report: this.generateReport(formValue)
    };

    this.demandService.updateDemand(this.selectedDemand.id, updates).subscribe({
      next: () => {
        this.toast.showSuccess('Processing completed successfully');
        this.loadProcessedDemands();
        this.resetForm();
      },
      error: (error) => {
        this.toast.showError('Failed to complete processing');
        console.error(error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  private async uploadPhotos(): Promise<string[]> {
    // Simulate photo upload - in real app, implement actual upload logic
    return this.selectedPhotos.map(photo => 
      `https://fakeupload.com/${Date.now()}_${photo.file.name}`
    );
  }

  private generateReport(formValue: any): Demand['report'] {
    return {
      reportId: `REP-${Date.now()}`,
      generatedDate: new Date().toISOString(),
      collectionSummary: `Collection processed with ${Math.abs(this.weightDifference)}g ${this.weightDifference >= 0 ? 'over' : 'under'} declared weight.`,
      environmentalImpact: {
        co2Saved: Math.round(formValue.actualWeight * 0.0005), // Example calculation
        treesEquivalent: Math.round(formValue.actualWeight * 0.0001) // Example calculation
      }
    };
  }

  private resetForm() {
    this.processingForm.reset();
    this.selectedDemand = null;
    this.selectedPhotos = [];
    this.weightDifference = 0;
    this.weightDifferencePercentage = 0;
  }

  getStatusClass(status: string): string {
    return {
      'pending': 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full',
      'in_progress': 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full',
      'completed': 'bg-green-100 text-green-800 px-2 py-1 rounded-full'
    }[status] || '';
  }
} 