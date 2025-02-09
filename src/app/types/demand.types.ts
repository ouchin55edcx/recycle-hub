export type DemandStatus = 'pending' | 'in_progress' | 'validated' | 'rejected' | 'occupied';

export type MaterialType = 'plastic' | 'glass' | 'paper' | 'metal';

export const DEMAND_STATUSES: Record<DemandStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  validated: 'Validated',
  rejected: 'Rejected',
  occupied: 'Occupied'
}; 