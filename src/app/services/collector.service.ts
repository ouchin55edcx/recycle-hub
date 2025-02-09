import { Injectable } from '@angular/core';
import { DemandService } from './demand.service';
import { AuthService } from './auth.service';
import { map, Observable } from 'rxjs';
import { Demand } from '../models/demand.model';

@Injectable({
  providedIn: 'root'
})
export class CollectorService {
  constructor(
    private demandService: DemandService,
    private authService: AuthService
  ) {}

  getDemandsInCity(): Observable<Demand[]> {
    const collectorCity = this.authService.currentUser?.address;
    
    return this.demandService.getAllDemands().pipe(
      map(demands => demands.filter(demand => 
        demand.address === collectorCity && 
        ['pending', 'in_progress'].includes(demand.status)
      ))
    );
  }
} 