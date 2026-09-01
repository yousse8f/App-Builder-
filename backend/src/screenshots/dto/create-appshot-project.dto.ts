import { IsString, IsOptional } from 'class-validator';

export class CreateAppshotProjectDto {
  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  templateId?: string;

  @IsString()
  @IsOptional()
  app?: string;

  @IsString()
  @IsOptional()
  bg?: string;
}
