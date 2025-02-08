// demand.model.ts
export interface Demand {
  id: number;
  type: 'plastic' | 'glass' | 'paper' | 'metal';
  weight: number;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  collectionTime: string;
  notes?: string;
  userId: number;
  photos?: string[];
}

// Type for creating a new demand without id
export type CreateDemandDto = Omit<Demand, 'id' | 'status'> & {
  status?: 'pending' | 'approved' | 'rejected';
};
