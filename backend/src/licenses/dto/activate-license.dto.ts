import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { LicenseType } from '@prisma/client';

export class ActivateLicenseDto {
  @IsString()
  @IsNotEmpty()
  licenseKey!: string;

  @IsEnum(LicenseType)
  @IsNotEmpty()
  type!: LicenseType;

  @IsString()
  @IsNotEmpty()
  domain!: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
