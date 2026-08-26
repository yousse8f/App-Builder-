import { IsEnum, IsNotEmpty } from 'class-validator';
import { LicenseStatus } from '@prisma/client';

export class UpdateLicenseStatusDto {
  @IsEnum(LicenseStatus)
  @IsNotEmpty()
  status: LicenseStatus;
}