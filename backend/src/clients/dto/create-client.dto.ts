import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @MinLength(2)
  companyName!: string;

  @IsString()
  @IsOptional()
  userId?: string;
}
