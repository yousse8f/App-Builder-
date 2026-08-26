import { IsEnum, IsNotEmpty, IsOptional, IsDateString, IsInt, Min } from 'class-validator';
import { LicenseType } from '@prisma/client';

export class CreateLicenseDto {
  @IsEnum(LicenseType)
  @IsNotEmpty()
  type: LicenseType;

  @IsNotEmpty()
  clientId: string;

  @IsOptional()
  domain?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  activationLimit?: number;
}