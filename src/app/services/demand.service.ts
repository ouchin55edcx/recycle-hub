// demand.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demand, CreateDemandDto } from '../models/demand.model';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DemandService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  createDemand(demand: CreateDemandDto): Observable<Demand> {
    console.log('Creating demand:', demand);
    return this.http.post<Demand>(`${this.apiUrl}/demands`, {
      ...demand,
      status: 'pending',
      id: this.generateId()
    }).pipe(
      tap(newDemand => console.log('Created demand:', newDemand))
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  getUserDemands(userId: string): Observable<Demand[]> {
    return this.http.get<Demand[]>(`${this.apiUrl}/demands?userId=${userId}`);
  }

  getDemandsByCity(city: string): Observable<Demand[]> {
    // Supposons que l'API filtre bien selon la ville extraite de l'adresse.
    return this.http.get<Demand[]>(`${this.apiUrl}/demands?address.city=${city}`);
  }

  getDemandById(id: number): Observable<Demand> {
    return this.http.get<Demand>(`${this.apiUrl}/demands/${id}`);
  }

  updateDemand(id: string, updates: Partial<Demand>): Observable<Demand> {
    return this.http.patch<Demand>(`${this.apiUrl}/demands/${id}`, updates);
  }

  deleteDemand(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/demands/${id}`);
  }

  getProcessingDemands(): Observable<Demand[]> {
    return this.http.get<Demand[]>(`${this.apiUrl}/demands?status=in_progress&status=completed`);
  }

  updateDemandStatus(id: string, status: Demand['status'], details?: any): Observable<Demand> {
    return this.http.patch<Demand>(`${this.apiUrl}/demands/${id}`, {
      status,
      ...details
    });
  }

  generateCollectionReport(demandId: string): Observable<Demand['report']> {
    return this.http.get<Demand>(`${this.apiUrl}/demands/${demandId}`).pipe(
      map(demand => {
        if (!demand.verificationDetails || !demand.actualWeight) {
          throw new Error('Verification details or actual weight not found');
        }
        
        // Now TypeScript knows actualWeight is defined
        const actualWeight = demand.actualWeight;
        
        return {
          reportId: `REP-${Date.now()}`,
          generatedDate: new Date().toISOString(),
          collectionSummary: `Collection of ${actualWeight}g of ${demand.types.join(', ')}`,
          environmentalImpact: {
            co2Saved: Math.round(actualWeight * 0.0005),
            treesEquivalent: Math.round(actualWeight * 0.0001)
          }
        };
      })
    );
  }
}
