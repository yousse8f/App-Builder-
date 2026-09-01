import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { BuildPlatform } from '@prisma/client';

export class CreateBuildDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsEnum(BuildPlatform)
  @IsNotEmpty()
  platform: BuildPlatform;
}
