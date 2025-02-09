import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PointsService } from '../../../services/points.service';
import { ToastService } from '../../../services/toast.service';
import { PointsTransaction, Voucher, VOUCHER_TIERS } from '../../../models/points.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-points',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Points Summary -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold mb-4">Points Balance</h2>
          <div class="text-4xl font-bold text-green-600 mb-4">
            {{ currentPoints }} points
          </div>
          
          <!-- Convert Points Form -->
          <form [formGroup]="conversionForm" (ngSubmit)="convertPoints()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Select Voucher</label>
              <select formControlName="points" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option [ngValue]="null">Choose amount</option>
                <option *ngFor="let tier of voucherTiers" [value]="tier.points">
                  {{ tier.points }} points = {{ tier.value }}DH
                </option>
              </select>
            </div>
            <button type="submit" 
                    [disabled]="!conversionForm.valid || conversionForm.value.points > currentPoints"
                    class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700
                           disabled:opacity-50 disabled:cursor-not-allowed">
              Convert to Voucher
            </button>
          </form>
        </div>

        <!-- Transaction History -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold mb-4">Transaction History</h2>
          <div class="space-y-4">
            <div *ngFor="let transaction of transactions" 
                 class="border-b pb-4 last:border-b-0">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium">{{ transaction.description }}</p>
                  <p class="text-sm text-gray-600">
                    {{ transaction.date | date:'medium' }}
                  </p>
                </div>
                <span [class]="transaction.type === 'earned' ? 
                              'text-green-600 font-medium' : 
                              'text-red-600 font-medium'">
                  {{ transaction.type === 'earned' ? '+' : '-' }}{{ transaction.amount }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Vouchers -->
        <div class="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h2 class="text-2xl font-bold mb-4">Your Vouchers</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let voucher of activeVouchers" 
                 class="border rounded-lg p-4">
              <div class="flex justify-between items-start mb-2">
                <span class="text-xl font-bold">{{ voucher.value }}DH</span>
                <span [class]="getVoucherStatusClass(voucher.status)">
                  {{ voucher.status }}
                </span>
              </div>
              <p class="text-gray-600 text-sm mb-2">Code: {{ voucher.code }}</p>
              <p class="text-gray-600 text-sm">
                Expires: {{ voucher.expiresAt | date }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PointsComponent implements OnInit {
  currentPoints = 0;
  transactions: PointsTransaction[] = [];
  activeVouchers: Voucher[] = [];
  voucherTiers = VOUCHER_TIERS;
  conversionForm: FormGroup;

  constructor(
    private pointsService: PointsService,
    private fb: FormBuilder,
    private toast: ToastService,
    private authService: AuthService
  ) {
    this.conversionForm = this.fb.group({
      points: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const userId = this.authService.currentUser?.id;
    if (!userId) {
      this.toast.showError('User not authenticated');
      return;
    }
    
    const userIdString = userId.toString();
    
    this.pointsService.getUserPoints(userIdString).subscribe({
      next: (points) => this.currentPoints = points,
      error: () => this.toast.showError('Failed to load points balance')
    });

    this.pointsService.getTransactionHistory(userIdString).subscribe({
      next: (transactions) => this.transactions = transactions,
      error: () => this.toast.showError('Failed to load transaction history')
    });

    this.pointsService.getUserVouchers(userIdString).subscribe({
      next: (vouchers) => this.activeVouchers = vouchers.filter(v => v.status === 'active'),
      error: () => this.toast.showError('Failed to load vouchers')
    });
  }

  convertPoints() {
    if (this.conversionForm.invalid) return;

    const userId = this.authService.currentUser?.id;
    if (!userId) {
      this.toast.showError('User not authenticated');
      return;
    }

    const userIdString = userId.toString();
    const pointsToConvert = this.conversionForm.value.points;

    this.pointsService.generateVoucher(userIdString, pointsToConvert).subscribe({
      next: (voucher) => {
        this.toast.showSuccess(`Successfully generated ${voucher.value}DH voucher`);
        this.loadUserData();
        this.conversionForm.reset();
      },
      error: () => this.toast.showError('Failed to generate voucher')
    });
  }

  getVoucherStatusClass(status: Voucher['status']): string {
    return {
      active: 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm',
      used: 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm',
      expired: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm'
    }[status];
  }
} 