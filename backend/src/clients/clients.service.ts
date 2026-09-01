import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientStatus, UserRole } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(currentUserId: string, currentUserRole: UserRole) {
    if (currentUserRole === UserRole.ADMIN) {
      return this.prisma.client.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
      });
    } else {
      // Regular users can only see their own client profile
      return this.prisma.client.findMany({
        where: { userId: currentUserId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
      });
    }
  }

  async findOne(id: string, currentUserId: string, currentUserRole: UserRole) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (currentUserRole !== UserRole.ADMIN && client.userId !== currentUserId) {
      throw new ForbiddenException('Access denied');
    }

    return client;
  }

  async create(
    createClientDto: CreateClientDto,
    currentUserId: string,
    currentUserRole: UserRole,
  ) {
    if (
      currentUserRole !== UserRole.ADMIN &&
      createClientDto.userId &&
      createClientDto.userId !== currentUserId
    ) {
      throw new ForbiddenException('You can only create a client for yourself');
    }

    const userId = createClientDto.userId || currentUserId;

    // Check if user already has a client profile
    const existingClient = await this.prisma.client.findUnique({
      where: { userId },
    });

    if (existingClient) {
      throw new ForbiddenException('User already has a client profile');
    }

    return this.prisma.client.create({
      data: {
        companyName: createClientDto.companyName,
        status: ClientStatus.ACTIVE,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
    currentUserId: string,
    currentUserRole: UserRole,
  ) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (currentUserRole !== UserRole.ADMIN && client.userId !== currentUserId) {
      throw new ForbiddenException('Access denied');
    }

    // Only admins can change status
    if (updateClientDto.status && currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can change client status');
    }

    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
    });
  }

  async block(id: string, currentUserId: string, currentUserRole: UserRole) {
    if (currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can block clients');
    }

    return this.update(
      id,
      { status: ClientStatus.BLOCKED },
      currentUserId,
      currentUserRole,
    );
  }

  async unblock(id: string, currentUserId: string, currentUserRole: UserRole) {
    if (currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can unblock clients');
    }

    return this.update(
      id,
      { status: ClientStatus.ACTIVE },
      currentUserId,
      currentUserRole,
    );
  }

  async suspend(id: string, currentUserId: string, currentUserRole: UserRole) {
    if (currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can suspend clients');
    }

    return this.update(
      id,
      { status: ClientStatus.SUSPENDED },
      currentUserId,
      currentUserRole,
    );
  }

  async unsuspend(
    id: string,
    currentUserId: string,
    currentUserRole: UserRole,
  ) {
    if (currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can unsuspend clients');
    }

    return this.update(
      id,
      { status: ClientStatus.ACTIVE },
      currentUserId,
      currentUserRole,
    );
  }

  async delete(id: string, currentUserId: string, currentUserRole: UserRole) {
    if (currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete clients');
    }

    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Delete the user (cascade will delete the client)
    await this.prisma.user.delete({
      where: { id: client.userId },
    });

    return {
      message: 'Client deleted successfully',
    };
  }

  // Template management methods
  async getClientTemplates(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return this.prisma.clientTemplate.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async assignTemplate(
    clientId: string,
    templateId: string,
    customName?: string,
  ) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Check if template is already assigned
    const existing = await this.prisma.clientTemplate.findUnique({
      where: {
        clientId_templateId: {
          clientId,
          templateId,
        },
      },
    });

    if (existing) {
      // Reactivate if it exists but is inactive
      if (!existing.isActive) {
        return this.prisma.clientTemplate.update({
          where: {
            clientId_templateId: {
              clientId,
              templateId,
            },
          },
          data: {
            isActive: true,
            customName: customName || existing.customName,
          },
        });
      }
      throw new ForbiddenException('Template already assigned to this client');
    }

    return this.prisma.clientTemplate.create({
      data: {
        clientId,
        templateId,
        customName,
        isActive: true,
      },
    });
  }

  async updateClientTemplate(
    clientId: string,
    templateId: string,
    updates: { customName?: string; isActive?: boolean },
  ) {
    const clientTemplate = await this.prisma.clientTemplate.findUnique({
      where: {
        clientId_templateId: {
          clientId,
          templateId,
        },
      },
    });

    if (!clientTemplate) {
      throw new NotFoundException('Template assignment not found');
    }

    return this.prisma.clientTemplate.update({
      where: {
        clientId_templateId: {
          clientId,
          templateId,
        },
      },
      data: updates,
    });
  }

  async removeTemplate(clientId: string, templateId: string) {
    const clientTemplate = await this.prisma.clientTemplate.findUnique({
      where: {
        clientId_templateId: {
          clientId,
          templateId,
        },
      },
    });

    if (!clientTemplate) {
      throw new NotFoundException('Template assignment not found');
    }

    await this.prisma.clientTemplate.delete({
      where: {
        clientId_templateId: {
          clientId,
          templateId,
        },
      },
    });

    return {
      message: 'Template removed successfully',
    };
  }
}
