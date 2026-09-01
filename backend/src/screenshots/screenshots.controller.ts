import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  HttpCode,
  HttpStatus,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { ScreenshotsService } from './screenshots.service';
import { CreateAppshotProjectDto } from './dto/create-appshot-project.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('screenshots')
@UseGuards(JwtAuthGuard)
export class ScreenshotsController {
  constructor(private readonly screenshotsService: ScreenshotsService) {}

  @Get('templates')
  getTemplates(
    @CurrentUser('client.id') clientId: string | null,
    @CurrentUser('role') userRole: string,
  ) {
    // Admin users can see all templates, clients only see their assigned ones
    if (userRole === 'ADMIN') {
      return this.screenshotsService.getTemplates(undefined);
    }
    return this.screenshotsService.getTemplates(clientId || undefined);
  }

  @Get('devices')
  getDevices() {
    return this.screenshotsService.getDevices();
  }

  @Post('projects')
  createAppshotProject(
    @CurrentUser('client.id') clientId: string | null,
    @Body() createAppshotProjectDto: CreateAppshotProjectDto,
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    if (!createAppshotProjectDto.projectId) {
      throw new BadRequestException('Project ID is required');
    }
    return this.screenshotsService.createAppshotProject(
      clientId,
      createAppshotProjectDto.projectId,
      createAppshotProjectDto,
    );
  }

  @Post('projects/link')
  @HttpCode(HttpStatus.OK)
  linkAppshotProject(
    @CurrentUser('client.id') clientId: string | null,
    @Body() body: { projectId: string; templateId: string; appName: string },
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    if (!body.projectId) {
      throw new BadRequestException('Project ID is required');
    }
    return this.screenshotsService.createAppshotProject(
      clientId,
      body.projectId,
      {
        projectId: body.projectId,
        templateId: body.templateId,
        app: body.appName,
      },
    );
  }

  @Get('projects/:appshotProjectName')
  getAppshotProject(
    @CurrentUser('client.id') clientId: string | null,
    @Param('appshotProjectName') appshotProjectName: string,
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    return this.screenshotsService.getAppshotProject(
      clientId,
      appshotProjectName,
    );
  }

  @Delete('projects/:appshotProjectName')
  deleteAppshotProject(
    @CurrentUser('client.id') clientId: string | null,
    @Param('appshotProjectName') appshotProjectName: string,
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    return this.screenshotsService.deleteAppshotProject(
      clientId,
      appshotProjectName,
    );
  }

  @Get('projects/:appshotProjectName/download')
  @Header('Content-Type', 'application/zip')
  @Header('Content-Disposition', 'attachment; filename="screenshots.zip"')
  async downloadScreenshots(
    @CurrentUser('client.id') clientId: string | null,
    @Param('appshotProjectName') appshotProjectName: string,
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    return this.screenshotsService.downloadScreenshots(
      clientId,
      appshotProjectName,
    );
  }
}
