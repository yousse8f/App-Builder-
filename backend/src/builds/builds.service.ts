import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBuildDto } from './dto/create-build.dto';
import { BuildStatus } from '@prisma/client';

@Injectable()
export class BuildsService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, createBuildDto: CreateBuildDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: createBuildDto.projectId },
      include: { client: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.clientId !== clientId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.build.create({
      data: {
        ...createBuildDto,
        status: BuildStatus.PENDING,
      },
    });
  }

  async findAll(clientId: string) {
    return this.prisma.build.findMany({
      where: {
        project: {
          clientId,
        },
      },
      include: {
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, clientId: string) {
    const build = await this.prisma.build.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            client: true,
          },
        },
      },
    });

    if (!build) {
      throw new NotFoundException('Build not found');
    }

    if (build.project.clientId !== clientId) {
      throw new ForbiddenException('Access denied');
    }

    return build;
  }

  async findByProject(projectId: string, clientId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.clientId !== clientId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.build.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
