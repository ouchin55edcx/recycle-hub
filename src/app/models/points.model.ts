export interface PointsTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'spent';
  source: 'collection' | 'voucher';
  demandId?: string;
  voucherId?: string;
  date: string;
  description: string;
}

export interface Voucher {
  id: string;
  userId: string;
  points: 100 | 200 | 500;
  value: 50 | 120 | 350;
  code: string;
  status: 'active' | 'used' | 'expired';
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
}

export const POINTS_RATES = {
  plastic: 2,  // points per kg
  glass: 1,
  paper: 1,
  metal: 5
};

export const VOUCHER_TIERS = [
  { points: 100, value: 50 },
  { points: 200, value: 120 },
  { points: 500, value: 350 }
] as const; 