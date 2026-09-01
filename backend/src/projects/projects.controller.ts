import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectScreenDto } from './dto/create-project-screen.dto';
import { ScreenshotsService } from '../screenshots/screenshots.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly screenshotsService: ScreenshotsService,
  ) {}

  @Post()
  async create(
    @CurrentUser('client.id') clientId: string | null,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }

    const project = await this.projectsService.create(
      clientId,
      createProjectDto,
    );

    // If this is a Screenshots project with template, create the corresponding Screenshots project
    if (
      createProjectDto.projectType === 'screenshots' &&
      createProjectDto.appshotTemplateId
    ) {
      try {
        const appshotResult =
          await this.screenshotsService.createAppshotProject(
            clientId,
            project.id,
            {
              projectId: project.id,
              templateId: createProjectDto.appshotTemplateId,
              app: createProjectDto.name,
            },
          );

        // Update the project with the Screenshots project name
        const updatedProject = await this.projectsService.update(
          project.id,
          clientId,
          {
            appshotProjectName: appshotResult.appshotProjectName,
          },
        );

        // Return the updated project
        return updatedProject;
      } catch {
        // Rollback: delete the project if Screenshots creation failed
        await this.projectsService.remove(project.id, clientId);
        throw new HttpException(
          'Failed to create Screenshots project',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    // If this is a Screenshots project created from AppShot export (appshotProjectName provided)
    if (
      createProjectDto.projectType === 'screenshots' &&
      createProjectDto.appshotProjectName
    ) {
      // The project already exists in AppShot, just link it
      const updatedProject = await this.projectsService.update(
        project.id,
        clientId,
        {
          appshotProjectName: createProjectDto.appshotProjectName,
        },
      );
      return updatedProject;
    }

    return project;
  }

  @Get()
  findAll(@CurrentUser('client.id') clientId: string | null) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    return this.projectsService.findAll(clientId);
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
    return this.projectsService.findOne(id, clientId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('client.id') clientId: string | null,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    return this.projectsService.update(id, clientId, updateProjectDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser('client.id') clientId: string | null,
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    return this.projectsService.remove(id, clientId);
  }

  @Post(':id/screens')
  addScreen(
    @Param('id') id: string,
    @CurrentUser('client.id') clientId: string | null,
    @Body() createScreenDto: CreateProjectScreenDto,
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    return this.projectsService.addScreen(id, clientId, createScreenDto);
  }

  @Patch('screens/:screenId')
  updateScreen(
    @Param('screenId') screenId: string,
    @CurrentUser('client.id') clientId: string | null,
    @Body() config: Record<string, unknown>,
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    return this.projectsService.updateScreen(screenId, clientId, config);
  }

  @Delete('screens/:screenId')
  removeScreen(
    @Param('screenId') screenId: string,
    @CurrentUser('client.id') clientId: string | null,
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    return this.projectsService.removeScreen(screenId, clientId);
  }

  @Post(':id/assets')
  addAsset(
    @Param('id') id: string,
    @CurrentUser('client.id') clientId: string | null,
    @Body() assetData: { name: string; type: string; url: string },
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    return this.projectsService.addAsset(id, clientId, assetData);
  }

  @Delete('assets/:assetId')
  removeAsset(
    @Param('assetId') assetId: string,
    @CurrentUser('client.id') clientId: string | null,
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    return this.projectsService.removeAsset(assetId, clientId);
  }

  @Patch('screens/:projectId')
  updateScreens(
    @Param('projectId') projectId: string,
    @CurrentUser('client.id') clientId: string | null,
    @Body() screens: any[],
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }
    return this.projectsService.updateScreens(projectId, clientId, screens);
  }

  @Post(':id/screenshots')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/screenshots',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  )
  async uploadScreenshot(
    @Param('id') id: string,
    @CurrentUser('client.id') clientId: string | null,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { deviceId?: string; fileName?: string },
  ) {
    if (!clientId) {
      throw new BadRequestException(
        'Client not found. Please ensure your account has a client profile.',
      );
    }

    const screenshotUrl = `/uploads/screenshots/${file.filename}`;

    // Store screenshot as an asset in the project
    return this.projectsService.addAsset(id, clientId, {
      name: body.fileName || file.filename,
      type: 'screenshot',
      url: screenshotUrl,
      deviceId: body.deviceId,
    });
  }
}
