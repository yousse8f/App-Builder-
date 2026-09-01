import { IsString, IsNotEmpty } from 'class-validator';

export class DeactivateLicenseDto {
  @IsString()
  @IsNotEmpty()
  licenseKey: string;

  @IsString()
  @IsNotEmpty()
  domain: string;
}
