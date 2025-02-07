import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demand } from '../models/demand.model';

@Injectable({ providedIn: 'root' })
export class DemandService {
  constructor(private http: HttpClient) {}

  createDemand(demand: Omit<Demand, 'id'>): Observable<Demand> {
    return this.http.post<Demand>('/demands', {
      ...demand,
      status: 'en_attente',
      requestDate: new Date().toISOString()
    });
  }

  getUserDemands(userId: number): Observable<Demand[]> {
    return this.http.get<Demand[]>(`/demands?userId=${userId}`);
  }

  getCollectorDemands(city: string): Observable<Demand[]> {
    return this.http.get<Demand[]>(`/demands?address.city=${city}&status=en_attente`);
  }

  updateDemandStatus(id: number, status: Demand['status']): Observable<Demand> {
    return this.http.patch<Demand>(`/demands/${id}`, { status });
  }

  deleteDemand(id: number): Observable<void> {
    return this.http.delete<void>(`/demands/${id}`);
  }

  updateDemand(id: number, updates: Partial<Demand>): Observable<Demand> {
    return this.http.patch<Demand>(`/demands/${id}`, updates);
  }
}