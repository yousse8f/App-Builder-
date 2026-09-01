export type LicenseType = 'PLUGIN' | 'BUILDER';
export type LicenseStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLOCKED' | 'EXPIRED';
export type ActivationStatus = 'ACTIVE' | 'INACTIVE';

export interface License {
  id: string;
  key: string;
  type: LicenseType;
  status: LicenseStatus;
  domain: string | null;
  activationLimit: number;
  activationCount: number;
  expiresAt: string | null;
  clientId: string;
  client: {
    id: string;
    companyName: string;
    status: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  activations: LicenseActivation[];
  createdAt: string;
  updatedAt: string;
}

export interface LicenseActivation {
  id: string;
  licenseId: string;
  domain: string;
  ipAddress: string | null;
  userAgent: string | null;
  activatedAt: string;
  lastValidatedAt: string | null;
  status: ActivationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LicenseLog {
  id: string;
  licenseId: string;
  action: string;
  domain: string | null;
  ipAddress: string | null;
  result: string;
  metadata: string | null;
  createdAt: string;
}

export interface CreateLicenseDto {
  type: LicenseType;
  clientId: string;
  domain?: string;
  expiresAt?: string;
  activationLimit?: number;
}

export interface UpdateLicenseStatusDto {
  status: LicenseStatus;
}

export interface ValidateLicenseDto {
  licenseKey: string;
  type: LicenseType;
  domain: string;
}

export interface ActivateLicenseDto {
  licenseKey: string;
  type: LicenseType;
  domain: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface DeactivateLicenseDto {
  licenseKey: string;
  domain: string;
}

export interface LicenseValidationResponse {
  valid: boolean;
  status?: LicenseStatus;
  type?: LicenseType;
  expiresAt?: string | null;
  error?: string;
  errorCode?: string;
}

export interface LicenseActivationResponse {
  success: boolean;
  message: string;
  activation?: {
    id: string;
    domain: string;
    activatedAt: string;
  };
  error?: string;
  errorCode?: string;
}
