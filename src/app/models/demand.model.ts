import { DemandStatus, MaterialType } from '../types/demand.types';

export interface Demand {
  id: string;
  types: MaterialType[];
  weight: number;
  address: string;
  requestDate: string;
  collectionTime: string;
  notes: string;
  userId: string;
  status: DemandStatus;
  collectorId?: string;
  actualWeight?: number;
  photos: string[];
  verificationDetails?: {
    weightDifference?: number;
    materialVerified: boolean;
    sortingCorrect: boolean;
    verificationNotes?: string;
    verificationDate?: string;
    verificationPhotos?: string[];
  };
  report?: {
    reportId: string;
    generatedDate: string;
    collectionSummary: string;
    environmentalImpact?: {
      co2Saved: number;
      treesEquivalent: number;
    };
  };
  rejectionReason?: string;
}

export interface CreateDemandDto {
  types: MaterialType[];
  weight: number;
  address: string;
  requestDate: string;
  collectionTime: string;
  notes: string;
  userId: string;
}
