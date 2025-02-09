export interface Demand {
  id: string;
  types: ('plastic' | 'glass' | 'paper' | 'metal')[]; 
  weight: number;
  actualWeight?: number;
  address: string;
  status: 'pending' | 'validated' | 'rejected' | 'in_progress' | 'occupied';
  requestDate: string;
  collectionTime: string;
  notes?: string;
  userId: string;
  collectorId?: string;
  photos?: string[];
  rejectionReason?: string;
}

export interface CreateDemandDto {
  types: ('plastic' | 'glass' | 'paper' | 'metal')[]; 
  weight: number;
  address: string;
  requestDate: string;
  collectionTime: string;
  userId: string;
}
