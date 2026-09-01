import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, LicenseStatus, PluginStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';

type CurrentUser = {
  id: string;
  role: UserRole;
};

@Injectable()
export class PluginsService {
  constructor(private readonly prisma: PrismaService) {}

  private async recordLog(
    pluginId: string,
    action: string,
    result: string,
    details?: string,
  ) {
    return this.prisma.pluginLog.create({
      data: {
        pluginId,
        action,
        result,
        details: details ?? null,
      },
    });
  }

  private async findClientByUserId(userId: string) {
    return this.prisma.client.findFirst({
      where: { userId },
    });
  }

  private async validatePluginLicense(plugin: {
    clientId: string;
    licenseId: string | null;
    config: Prisma.JsonValue | null;
    license?: {
      id: string;
      type: string;
      status: LicenseStatus;
      expiresAt: Date | null;
      clientId: string;
    } | null;
  }) {
    if (!plugin.licenseId || !plugin.license) {
      return {
        valid: false,
        reason: 'Plugin is not linked to a valid plugin license.',
      };
    }

    if (plugin.license.type !== 'PLUGIN') {
      return {
        valid: false,
        reason: 'Only PLUGIN license types are allowed for plugins.',
      };
    }

    if (plugin.license.clientId !== plugin.clientId) {
      return {
        valid: false,
        reason: 'License does not belong to the same client.',
      };
    }

    if (plugin.license.status !== LicenseStatus.ACTIVE) {
      return {
        valid: false,
        reason: `License is ${plugin.license.status.toLowerCase()}.`,
      };
    }

    if (plugin.license.expiresAt && new Date() > plugin.license.expiresAt) {
      await this.prisma.license.update({
        where: { id: plugin.license.id },
        data: { status: LicenseStatus.EXPIRED },
      });
      return { valid: false, reason: 'License has expired.' };
    }

    return { valid: true, reason: 'License is valid.' };
  }

  private async ensureAccess(pluginId: string, user: CurrentUser) {
    const plugin = await this.prisma.plugin.findUnique({
      where: { id: pluginId },
      include: {
        client: true,
        license: true,
      },
    });

    if (!plugin) {
      throw new NotFoundException('Plugin not found');
    }

    if (user.role !== UserRole.ADMIN && plugin.client.userId !== user.id) {
      throw new ForbiddenException(
        'You cannot access plugins owned by another client',
      );
    }

    return plugin;
  }

  async findAll(user: CurrentUser) {
    if (user.role === UserRole.ADMIN) {
      return this.prisma.plugin.findMany({
        include: {
          client: {
            select: {
              id: true,
              companyName: true,
            },
          },
          license: {
            select: {
              id: true,
              key: true,
              status: true,
              type: true,
              expiresAt: true,
            },
          },
          logs: {
            take: 3,
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    const client = await this.findClientByUserId(user.id);
    if (!client) {
      return [];
    }

    return this.prisma.plugin.findMany({
      where: { clientId: client.id },
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
          },
        },
        license: {
          select: {
            id: true,
            key: true,
            status: true,
            type: true,
            expiresAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, user: CurrentUser) {
    await this.ensureAccess(id, user);

    return this.prisma.plugin.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        license: {
          select: {
            id: true,
            key: true,
            type: true,
            status: true,
            expiresAt: true,
            domain: true,
          },
        },
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
  }

  async create(dto: CreatePluginDto, user: CurrentUser) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can create plugins');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (dto.licenseId) {
      const license = await this.prisma.license.findUnique({
        where: { id: dto.licenseId },
      });

      if (!license) {
        throw new NotFoundException('License not found');
      }

      if (license.clientId !== dto.clientId) {
        throw new BadRequestException(
          'Selected license does not belong to the client',
        );
      }

      if (license.type !== 'PLUGIN') {
        throw new BadRequestException(
          'Only PLUGIN licenses can be linked to plugins',
        );
      }
    }

    const existing = await this.prisma.plugin.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new BadRequestException('A plugin with this slug already exists');
    }

    const pluginData: Prisma.PluginCreateInput = {
      name: dto.name,
      slug: dto.slug,
      description: dto.description ?? null,
      version: dto.version ?? '1.0.0',
      status: dto.status ?? PluginStatus.INACTIVE,
      client: {
        connect: { id: dto.clientId },
      },
      license: dto.licenseId ? { connect: { id: dto.licenseId } } : undefined,
      fileUrl: dto.fileUrl ?? null,
      iconUrl: dto.iconUrl ?? null,
      config: (dto.config ?? {}) as Prisma.InputJsonValue,
    };

    const plugin = await this.prisma.plugin.create({
      data: pluginData,
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
          },
        },
        license: {
          select: {
            id: true,
            key: true,
            type: true,
            status: true,
            expiresAt: true,
          },
        },
      },
    });

    await this.recordLog(
      plugin.id,
      'PLUGIN_CREATED',
      'SUCCESS',
      'Plugin created by admin',
    );

    return plugin;
  }

  async update(id: string, dto: UpdatePluginDto, user: CurrentUser) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can update plugins');
    }

    const plugin = await this.ensureAccess(id, user);

    if (dto.licenseId) {
      const license = await this.prisma.license.findUnique({
        where: { id: dto.licenseId },
      });

      if (!license) {
        throw new NotFoundException('License not found');
      }

      if (license.type !== 'PLUGIN') {
        throw new BadRequestException(
          'Only PLUGIN licenses can be linked to plugins',
        );
      }

      if (license.clientId !== plugin.clientId) {
        throw new BadRequestException(
          'Selected license must belong to the plugin client',
        );
      }
    }

    if (dto.slug) {
      const existing = await this.prisma.plugin.findUnique({
        where: { slug: dto.slug },
      });

      if (existing && existing.id !== id) {
        throw new BadRequestException('A plugin with this slug already exists');
      }
    }

    const updateData: Prisma.PluginUpdateInput = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.slug !== undefined && { slug: dto.slug }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.version !== undefined && { version: dto.version }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.licenseId !== undefined && { licenseId: dto.licenseId ?? null }),
      ...(dto.fileUrl !== undefined && { fileUrl: dto.fileUrl ?? null }),
      ...(dto.iconUrl !== undefined && { iconUrl: dto.iconUrl ?? null }),
      ...(dto.config !== undefined && {
        config: dto.config as Prisma.InputJsonValue,
      }),
    };

    const updated = await this.prisma.plugin.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
        license: true,
      },
    });

    await this.recordLog(
      updated.id,
      'CONFIG_UPDATED',
      'SUCCESS',
      'Plugin configuration updated',
    );

    return updated;
  }

  async remove(id: string, user: CurrentUser) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can delete plugins');
    }

    const plugin = await this.ensureAccess(id, user);

    // delete any attached file on disk
    if (plugin.fileUrl) {
      try {
        const fs = await import('fs');
        if (fs.existsSync(plugin.fileUrl)) {
          fs.unlinkSync(plugin.fileUrl);
        }
      } catch {
        // ignore file deletion failures
      }
    }

    await this.prisma.plugin.delete({
      where: { id: plugin.id },
    });

    await this.recordLog(
      plugin.id,
      'PLUGIN_DELETED',
      'SUCCESS',
      'Plugin removed by admin',
    );

    return { message: 'Plugin deleted successfully' };
  }

  async attachFile(id: string, filename: string, path: string) {
    const plugin = await this.prisma.plugin.findUnique({ where: { id } });
    if (!plugin) throw new NotFoundException('Plugin not found');

    const updated = await this.prisma.plugin.update({
      where: { id },
      data: {
        fileUrl: path,
        fileKey: filename,
      },
    });

    await this.recordLog(
      id,
      'PLUGIN_FILE_UPLOADED',
      'SUCCESS',
      `File ${filename} attached`,
    );

    return {
      fileKey: filename,
      fileUrl: path,
      plugin: updated,
    };
  }

  async getFile(id: string) {
    const plugin = await this.prisma.plugin.findUnique({ where: { id } });
    if (!plugin || !plugin.fileUrl) return null;
    return { filename: plugin.fileKey, path: plugin.fileUrl };
  }

  async activate(id: string, user: CurrentUser) {
    const plugin = await this.ensureAccess(id, user);
    const validation = await this.validatePluginLicense(plugin);

    if (!validation.valid) {
      await this.prisma.plugin.update({
        where: { id },
        data: {
          status: PluginStatus.DISABLED,
          config: {
            ...(plugin.config as Record<string, unknown>),
            enabled: false,
          },
        },
      });

      await this.recordLog(
        plugin.id,
        'PLUGIN_ACTIVATION_FAILED',
        'BLOCKED',
        validation.reason,
      );

      return {
        success: false,
        status: PluginStatus.DISABLED,
        message: validation.reason,
      };
    }

    const updated = await this.prisma.plugin.update({
      where: { id },
      data: {
        status: PluginStatus.ACTIVE,
        config: {
          ...(plugin.config as Record<string, unknown>),
          enabled: true,
        },
      },
    });

    await this.recordLog(
      updated.id,
      'PLUGIN_ACTIVATED',
      'SUCCESS',
      'Plugin activated successfully',
    );

    return {
      success: true,
      status: updated.status,
      plugin: updated,
    };
  }

  async deactivate(id: string, user: CurrentUser) {
    const plugin = await this.ensureAccess(id, user);

    const updated = await this.prisma.plugin.update({
      where: { id },
      data: {
        status: PluginStatus.INACTIVE,
        config: {
          ...(plugin.config as Record<string, unknown>),
          enabled: false,
        },
      },
    });

    await this.recordLog(
      updated.id,
      'PLUGIN_DISABLED',
      'SUCCESS',
      'Plugin deactivated',
    );

    return {
      success: true,
      status: updated.status,
      plugin: updated,
    };
  }
}
