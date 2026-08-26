import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePluginDto } from './create-plugin.dto';

export class UpdatePluginDto extends PartialType(
  OmitType(CreatePluginDto, ['clientId'] as const),
) {}
