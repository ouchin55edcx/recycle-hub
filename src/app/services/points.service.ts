import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { PointsTransaction, Voucher, POINTS_RATES, VOUCHER_TIERS } from '../models/points.model';
import { Demand } from '../models/demand.model';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private apiUrl = 'http://localhost:3000';
  private readonly POINTS_CONVERSION: Record<string, number> = {
    '100': 50,   // 100 points = 50 Dh
    '200': 120,  // 200 points = 120 Dh
    '500': 350   // 500 points = 350 Dh
  };

  constructor(private http: HttpClient) {}

  getUserPoints(userId: string): Observable<number> {
    return this.http.get<PointsTransaction[]>(
      `${this.apiUrl}/pointsTransactions?userId=${userId}`
    ).pipe(
      map(transactions => transactions.reduce((total, t) => 
        total + (t.type === 'earned' ? t.amount : -t.amount), 0)
      )
    );
  }

  getTransactionHistory(userId: string): Observable<PointsTransaction[]> {
    return this.http.get<PointsTransaction[]>(
      `${this.apiUrl}/pointsTransactions?userId=${userId}&_sort=date&_order=desc`
    );
  }

  calculatePointsForDemand(demand: Demand): number {
    if (!demand.actualWeight || !demand.types) return 0;
    
    return demand.types.reduce((points, type) => {
      const rate = POINTS_RATES[type.toLowerCase() as keyof typeof POINTS_RATES];
      return points + (rate * demand.actualWeight! / 1000); // Convert g to kg
    }, 0);
  }

  awardPointsForCollection(demand: Demand): Observable<PointsTransaction> {
    const points = this.calculatePointsForDemand(demand);
    const transaction: Omit<PointsTransaction, 'id'> = {
      userId: demand.userId,
      amount: points,
      type: 'earned',
      source: 'collection',
      demandId: demand.id,
      date: new Date().toISOString(),
      description: `Points earned from ${demand.types.join(', ')} collection (${demand.actualWeight! / 1000}kg)`
    };

    return this.http.post<PointsTransaction>(`${this.apiUrl}/pointsTransactions`, transaction);
  }

  generateVoucher(userId: string, pointsToSpend: 100 | 200 | 500): Observable<Voucher> {
    const tier = VOUCHER_TIERS.find(t => t.points === pointsToSpend);
    if (!tier) throw new Error('Invalid points amount');

    const voucher: Omit<Voucher, 'id'> = {
      userId,
      points: pointsToSpend,
      value: tier.value,
      code: this.generateVoucherCode(),
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };

    // Create voucher and deduct points
    return this.http.post<Voucher>(`${this.apiUrl}/vouchers`, voucher).pipe(
      map(newVoucher => {
        const transaction: Omit<PointsTransaction, 'id'> = {
          userId,
          amount: pointsToSpend,
          type: 'spent',
          source: 'voucher',
          voucherId: newVoucher.id,
          date: new Date().toISOString(),
          description: `Converted ${pointsToSpend} points to ${tier.value}DH voucher`
        };
        this.http.post(`${this.apiUrl}/pointsTransactions`, transaction).subscribe();
        return newVoucher;
      })
    );
  }

  getUserVouchers(userId: string): Observable<Voucher[]> {
    return this.http.get<Voucher[]>(
      `${this.apiUrl}/vouchers?userId=${userId}&_sort=createdAt&_order=desc`
    );
  }

  getAvailableConversions() {
    return this.POINTS_CONVERSION;
  }

  convertPointsToVoucher(userId: string, points: number): Observable<any> {
    const pointsStr = points.toString();
    const value = this.POINTS_CONVERSION[pointsStr];
    
    if (!value) {
      throw new Error('Invalid points conversion amount');
    }

    const voucher = {
      userId,
      points,
      value,
      code: this.generateVoucherCode(),
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };

    return this.http.post(`${this.apiUrl}/vouchers`, voucher);
  }

  private generateVoucherCode(): string {
    return 'VOUCHER' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}   