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
      <!-- Points Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Total Points Card -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Points</h3>
          <div class="text-3xl font-bold text-green-600">{{ currentPoints }}</div>
          <p class="text-sm text-gray-500 mt-1">Available for conversion</p>
        </div>

        <!-- Points Earned Card -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Points Earned</h3>
          <div class="text-3xl font-bold text-blue-600">{{ totalEarned }}</div>
          <p class="text-sm text-gray-500 mt-1">Total from collections</p>
        </div>

        <!-- Points Spent Card -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Points Spent</h3>
          <div class="text-3xl font-bold text-orange-600">{{ totalSpent }}</div>
          <p class="text-sm text-gray-500 mt-1">Converted to vouchers</p>
        </div>

        <!-- Total DH Value Card -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Value</h3>
          <div class="text-3xl font-bold text-purple-600">{{ totalDhValue }} DH</div>
          <p class="text-sm text-gray-500 mt-1">Active vouchers value</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Points Conversion Section -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6">Convert Points to Vouchers</h2>
          
          <!-- Points Conversion Rates -->
          <div class="mb-6 space-y-4">
            <h3 class="text-lg font-semibold text-gray-700">Available Conversions:</h3>
            <div class="grid grid-cols-1 gap-4">
              <div *ngFor="let tier of voucherTiers" 
                   class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span class="font-semibold">{{ tier.points }} points</span>
                  <span class="text-gray-600"> = </span>
                  <span class="text-green-600 font-bold">{{ tier.value }} DH</span>
                </div>
                <button 
                  (click)="convertPoints(tier.points)"
                  [disabled]="currentPoints < tier.points"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                         disabled:opacity-50 disabled:cursor-not-allowed">
                  Convert
                </button>
              </div>
            </div>
          </div>

          <!-- Points Earning Rates -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Points Earning Rates:</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="font-semibold">Plastic</div>
                <div class="text-green-600">2 points/kg</div>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="font-semibold">Glass</div>
                <div class="text-green-600">3 points/kg</div>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="font-semibold">Paper</div>
                <div class="text-green-600">1 point/kg</div>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="font-semibold">Metal</div>
                <div class="text-green-600">4 points/kg</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Transaction History -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6">Transaction History</h2>
          <div class="space-y-4 max-h-[600px] overflow-y-auto">
            <div *ngFor="let transaction of transactions" 
                 class="p-4 rounded-lg" 
                 [ngClass]="{'bg-green-50': transaction.type === 'earned', 
                            'bg-orange-50': transaction.type === 'spent'}">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium">{{ transaction.description }}</p>
                  <p class="text-sm text-gray-600">
                    {{ transaction.date | date:'medium' }}
                  </p>
                </div>
                <span [class]="transaction.type === 'earned' ? 
                              'text-green-600 font-bold' : 
                              'text-orange-600 font-bold'">
                  {{ transaction.type === 'earned' ? '+' : '-' }}{{ transaction.amount }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Vouchers -->
      <div class="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Your Active Vouchers</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let voucher of activeVouchers" 
               class="border rounded-xl p-6 bg-gradient-to-br from-green-50 to-green-100">
            <div class="flex justify-between items-start mb-4">
              <span class="text-2xl font-bold text-green-700">{{ voucher.value }} DH</span>
              <span [class]="getVoucherStatusClass(voucher.status)">
                {{ voucher.status }}
              </span>
            </div>
            <p class="text-gray-700 font-medium mb-2">Code: {{ voucher.code }}</p>
            <p class="text-sm text-gray-600">
              Expires: {{ voucher.expiresAt | date }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PointsComponent implements OnInit {
  currentPoints = 0;
  totalEarned = 0;
  totalSpent = 0;
  totalDhValue = 0;
  transactions: PointsTransaction[] = [];
  activeVouchers: Voucher[] = [];
  voucherTiers = VOUCHER_TIERS;

  constructor(
    private pointsService: PointsService,
    private toast: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadTransactions();
    this.loadVouchers();
  }

  loadTransactions() {
    const userId = this.authService.currentUser?.id;
    if (!userId) return;

    this.pointsService.getTransactionHistory(userId).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.calculateTotals(transactions);
      },
      error: () => this.toast.showError('Failed to load transactions')
    });
  }

  private calculateTotals(transactions: PointsTransaction[]) {
    this.totalEarned = transactions
      .filter(t => t.type === 'earned')
      .reduce((sum, t) => sum + t.amount, 0);

    this.totalSpent = transactions
      .filter(t => t.type === 'spent')
      .reduce((sum, t) => sum + t.amount, 0);

    this.currentPoints = this.totalEarned - this.totalSpent;
  }

  loadVouchers() {
    const userId = this.authService.currentUser?.id;
    if (!userId) return;

    this.pointsService.getUserVouchers(userId).subscribe({
      next: (vouchers) => {
        this.activeVouchers = vouchers.filter(v => v.status === 'active');
        this.calculateTotalDhValue();
      },
      error: () => this.toast.showError('Failed to load vouchers')
    });
  }

  private calculateTotalDhValue() {
    this.totalDhValue = this.activeVouchers.reduce((total, voucher) => total + voucher.value, 0);
  }

  convertPoints(points: number) {
    const userId = this.authService.currentUser?.id;
    if (!userId) return;

    if (this.currentPoints < points) {
      this.toast.showError('Insufficient points');
      return;
    }

    this.pointsService.generateVoucher(userId, points as 100 | 200 | 500).subscribe({
      next: (voucher) => {
        this.toast.showSuccess(`Successfully generated ${voucher.value}DH voucher`);
        this.loadTransactions();
        this.loadVouchers();
      },
      error: () => this.toast.showError('Failed to generate voucher')
    });
  }

  getVoucherStatusClass(status: string): string {
    return {
      'active': 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium',
      'used': 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium',
      'expired': 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium'
    }[status] || '';
  }
} 