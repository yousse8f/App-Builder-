import { IsOptional, IsString, MinLength, IsEnum } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['en', 'es', 'fr'])
  language?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
