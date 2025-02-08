// demand.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demand, CreateDemandDto } from '../models/demand.model';

@Injectable({
  providedIn: 'root'
})
export class DemandService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  createDemand(demand: CreateDemandDto): Observable<Demand> {
    return this.http.post<Demand>(`${this.apiUrl}/demands`, {
      ...demand,
      status: 'pending'
    });
  }

  getUserDemands(userId: number): Observable<Demand[]> {
    return this.http.get<Demand[]>(`${this.apiUrl}/demands?userId=${userId}`);
  }

  deleteDemand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/demands/${id}`);
  }

  // New: Get demands filtered by status and city (partial match on address)
  getDemandsByStatusAndCity(status: string, city: string): Observable<Demand[]> {
    return this.http.get<Demand[]>(`${this.apiUrl}/demands?status=${status}&address_like=${city}`);
  }

  // New: Update only the status field of a demand
  updateDemandStatus(id: number, newStatus: string): Observable<Demand> {
    return this.http.patch<Demand>(`${this.apiUrl}/demands/${id}`, { status: newStatus });
  }
}
