import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientStatus } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(currentUserId: string, currentUserRole: string) {
    if (currentUserRole === 'ADMIN') {
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

  async findOne(id: string, currentUserId: string, currentUserRole: string) {
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

    if (currentUserRole !== 'ADMIN' && client.userId !== currentUserId) {
      throw new ForbiddenException('Access denied');
    }

    return client;
  }

  async create(createClientDto: CreateClientDto, currentUserId: string, currentUserRole: string) {
    if (currentUserRole !== 'ADMIN' && createClientDto.userId && createClientDto.userId !== currentUserId) {
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

  async update(id: string, updateClientDto: UpdateClientDto, currentUserId: string, currentUserRole: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (currentUserRole !== 'ADMIN' && client.userId !== currentUserId) {
      throw new ForbiddenException('Access denied');
    }

    // Only admins can change status
    if (updateClientDto.status && currentUserRole !== 'ADMIN') {
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

  async block(id: string, currentUserId: string, currentUserRole: string) {
    if (currentUserRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can block clients');
    }

    return this.update(id, { status: ClientStatus.BLOCKED }, currentUserId, currentUserRole);
  }

  async unblock(id: string, currentUserId: string, currentUserRole: string) {
    if (currentUserRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can unblock clients');
    }

    return this.update(id, { status: ClientStatus.ACTIVE }, currentUserId, currentUserRole);
  }

  async suspend(id: string, currentUserId: string, currentUserRole: string) {
    if (currentUserRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can suspend clients');
    }

    return this.update(id, { status: ClientStatus.SUSPENDED }, currentUserId, currentUserRole);
  }

  async unsuspend(id: string, currentUserId: string, currentUserRole: string) {
    if (currentUserRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can unsuspend clients');
    }

    return this.update(id, { status: ClientStatus.ACTIVE }, currentUserId, currentUserRole);
  }

  async delete(id: string, currentUserId: string, currentUserRole: string) {
    if (currentUserRole !== 'ADMIN') {
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
}
