import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { BuildsService } from './builds.service';
import { CreateBuildDto } from './dto/create-build.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('builds')
@UseGuards(JwtAuthGuard)
export class BuildsController {
  constructor(private readonly buildsService: BuildsService) {}

  @Post()
  create(
    @CurrentUser('client.id') clientId: string | null,
    @Body() createBuildDto: CreateBuildDto,
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    return this.buildsService.create(clientId, createBuildDto);
  }

  @Get()
  findAll(@CurrentUser('client.id') clientId: string | null) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    return this.buildsService.findAll(clientId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser('client.id') clientId: string | null,
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    return this.buildsService.findOne(id, clientId);
  }

  @Get('project/:projectId')
  findByProject(
    @Param('projectId') projectId: string,
    @CurrentUser('client.id') clientId: string | null,
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    return this.buildsService.findByProject(projectId, clientId);
  }
}
