export type UserRole = 'particulier' | 'collecteur';

export interface UserPermissions {
  canCreateDemand: boolean;
  canEditDemand: boolean;
  canDeleteDemand: boolean;
  canViewDemands: boolean;
  canAcceptDemands: boolean;
  canValidateDemands: boolean;
  canRejectDemands: boolean;
  canConvertPoints: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  particulier: {
    canCreateDemand: true,
    canEditDemand: true,
    canDeleteDemand: true,
    canViewDemands: true,
    canAcceptDemands: false,
    canValidateDemands: false,
    canRejectDemands: false,
    canConvertPoints: true
  },
  collecteur: {
    canCreateDemand: false,
    canEditDemand: false,
    canDeleteDemand: false,
    canViewDemands: true,
    canAcceptDemands: true,
    canValidateDemands: true,
    canRejectDemands: true,
    canConvertPoints: false
  }
}; 