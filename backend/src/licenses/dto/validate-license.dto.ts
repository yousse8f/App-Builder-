import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LicenseType } from '@prisma/client';

export class ValidateLicenseDto {
  @IsString()
  @IsNotEmpty()
  licenseKey!: string;

  @IsEnum(LicenseType)
  @IsNotEmpty()
  type!: LicenseType;

  @IsString()
  @IsNotEmpty()
  domain!: string;
}