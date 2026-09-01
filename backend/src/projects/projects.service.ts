import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectScreenDto } from './dto/create-project-screen.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(private prisma: PrismaService) {}

  async create(clientId: string, createProjectDto: CreateProjectDto) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        clientId,
      },
      include: {
        screens: {
          orderBy: { order: 'asc' },
        },
        assets: true,
      },
    });
  }

  async findAll(clientId: string) {
    return this.prisma.project.findMany({
      where: { clientId },
      include: {
        screens: {
          orderBy: { order: 'asc' },
        },
        assets: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, clientId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        screens: {
          orderBy: { order: 'asc' },
        },
        assets: true,
        client: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.clientId !== clientId) {
      throw new ForbiddenException('Access denied');
    }

    return project;
  }

  async update(
    id: string,
    clientId: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.clientId !== clientId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
      include: {
        screens: {
          orderBy: { order: 'asc' },
        },
        assets: true,
      },
    });
  }

  async remove(id: string, clientId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.clientId !== clientId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.project.delete({
      where: { id },
    });
  }

  async addScreen(
    projectId: string,
    clientId: string,
    createScreenDto: CreateProjectScreenDto,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.clientId !== clientId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.projectScreen.create({
      data: {
        name: createScreenDto.name,
        order: createScreenDto.order,
        config: createScreenDto.config,
        projectId,
      },
    });
  }

  async updateScreen(
    screenId: string,
    clientId: string,
    config: Record<string, any>,
  ) {
    const screen = await this.prisma.projectScreen.findUnique({
      where: { id: screenId },
      include: { project: true },
    });

    if (!screen) {
      throw new NotFoundException('Screen not found');
    }

    if (screen.project.clientId !== clientId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.projectScreen.update({
      where: { id: screenId },
      data: { config },
    });
  }

  async removeScreen(screenId: string, clientId: string) {
    const screen = await this.prisma.projectScreen.findUnique({
      where: { id: screenId },
      include: { project: true },
    });

    if (!screen) {
      throw new NotFoundException('Screen not found');
    }

    if (screen.project.clientId !== clientId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.projectScreen.delete({
      where: { id: screenId },
    });
  }

  async addAsset(
    projectId: string,
    clientId: string,
    assetData: {
      name: string;
      type: string;
      url: string;
      deviceId?: string;
      metadata?: any;
    },
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.clientId !== clientId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.projectAsset.create({
      data: {
        name: assetData.name,
        type: assetData.type,
        url: assetData.url,
        deviceId: assetData.deviceId,
        metadata: assetData.metadata || {},
        projectId,
      },
    });
  }

  async removeAsset(assetId: string, clientId: string) {
    const asset = await this.prisma.projectAsset.findUnique({
      where: { id: assetId },
      include: { project: true },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    if (asset.project.clientId !== clientId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.projectAsset.delete({
      where: { id: assetId },
    });
  }

  async updateScreens(projectId: string, clientId: string, screens: any[]) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.clientId !== clientId) {
      throw new ForbiddenException('Access denied');
    }

    // Delete existing screens
    await this.prisma.projectScreen.deleteMany({
      where: { projectId },
    });

    // Create new screens
    for (const screen of screens) {
      await this.prisma.projectScreen.create({
        data: {
          id: screen.id,
          name: screen.name,
          order: screen.order,
          config: screen.config ?? Prisma.JsonNull,
          projectId,
        },
      });
    }

    return this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        screens: {
          orderBy: { order: 'asc' },
        },
        assets: true,
      },
    });
  }
}
