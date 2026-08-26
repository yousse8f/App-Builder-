import { LicenseType, LicenseStatus } from '@prisma/client';

export class LicenseResponseDto {
  id!: string;
  key!: string;
  type!: LicenseType;
  status!: LicenseStatus;
  domain!: string | null;
  activationLimit!: number;
  activationCount!: number;
  expiresAt!: Date | null;
  clientId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class LicenseValidationResponseDto {
  valid!: boolean;
  status?: LicenseStatus;
  type?: LicenseType;
  expiresAt?: Date | null;
  error?: string;
  errorCode?: string;
}

export class LicenseActivationResponseDto {
  success!: boolean;
  message!: string;
  activation?: {
    id: string;
    domain: string;
    activatedAt: Date;
  };
  error?: string;
  errorCode?: string;
}

export class LicenseErrorCodes {
  static readonly LICENSE_NOT_FOUND = 'LICENSE_NOT_FOUND';
  static readonly INVALID_LICENSE_TYPE = 'INVALID_LICENSE_TYPE';
  static readonly LICENSE_EXPIRED = 'LICENSE_EXPIRED';
  static readonly LICENSE_BLOCKED = 'LICENSE_BLOCKED';
  static readonly LICENSE_SUSPENDED = 'LICENSE_SUSPENDED';
  static readonly LICENSE_INACTIVE = 'LICENSE_INACTIVE';
  static readonly INVALID_DOMAIN = 'INVALID_DOMAIN';
  static readonly ACTIVATION_LIMIT_REACHED = 'ACTIVATION_LIMIT_REACHED';
  static readonly CLIENT_BLOCKED = 'CLIENT_BLOCKED';
  static readonly INVALID_SIGNATURE = 'INVALID_SIGNATURE';
  static readonly DOMAIN_ALREADY_ACTIVATED = 'DOMAIN_ALREADY_ACTIVATED';
  static readonly ACTIVATION_NOT_FOUND = 'ACTIVATION_NOT_FOUND';
  static readonly LICENSE_NOT_ACTIVE = 'LICENSE_NOT_ACTIVE';
}