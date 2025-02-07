export interface Demand {
    id?: number;
    types: ('plastic' | 'glass' | 'paper' | 'metal')[];
    photos?: string[];
    weight: number;
    realWeight?: number;
    address: string;
    requestDate: string;
    collectionDate?: string;
    status: 'en_attente' | 'occupée' | 'en_cours' | 'validée' | 'rejetée';
    userId: number;
    collectorId?: number;
    notes?: string;
  }