import { IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ClientStatus } from '@prisma/client';

export class UpdateClientDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  companyName?: string;

  @IsEnum(ClientStatus)
  @IsOptional()
  status?: ClientStatus;
}