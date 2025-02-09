import { Injectable } from '@angular/core';
import { DemandService } from './demand.service';
import { map, Observable } from 'rxjs';
import { Demand } from '../models/demand.model';

@Injectable({
  providedIn: 'root'
})
export class DemandLimitsService {
  private readonly MAX_PENDING_DEMANDS = 3;
  private readonly MAX_TOTAL_WEIGHT = 10000; // 10kg in grams

  constructor(private demandService: DemandService) {}

  canCreateDemand(userId: string): Observable<{allowed: boolean; reason?: string}> {
    return this.demandService.getUserDemands(userId).pipe(
      map(demands => {
        const pendingDemands = demands.filter(d => d.status === 'pending');
        
        // Check max pending demands
        if (pendingDemands.length >= this.MAX_PENDING_DEMANDS) {
          return {
            allowed: false,
            reason: `Maximum ${this.MAX_PENDING_DEMANDS} pending demands allowed`
          };
        }

        // Check total weight
        const totalWeight = pendingDemands.reduce((sum, d) => sum + d.weight, 0);
        if (totalWeight >= this.MAX_TOTAL_WEIGHT) {
          return {
            allowed: false,
            reason: 'Maximum 10kg total weight reached for pending demands'
          };
        }

        return { allowed: true };
      })
    );
  }
} 