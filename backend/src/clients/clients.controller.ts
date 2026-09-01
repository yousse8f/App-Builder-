import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Clients')
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: 200, description: 'List of clients' })
  async findAll(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.clientsService.findAll(userId, userRole);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiResponse({ status: 200, description: 'Client details' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.clientsService.findOne(id, userId, userRole);
  }

  @Post()
  @ApiOperation({ summary: 'Create new client' })
  @ApiResponse({ status: 201, description: 'Client successfully created' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async create(
    @Body() createClientDto: CreateClientDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.clientsService.create(createClientDto, userId, userRole);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update client' })
  @ApiResponse({ status: 200, description: 'Client successfully updated' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.clientsService.update(id, updateClientDto, userId, userRole);
  }

  @Patch(':id/block')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Block client (Admin only)' })
  @ApiResponse({ status: 200, description: 'Client successfully blocked' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async block(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.clientsService.block(id, userId, userRole);
  }

  @Patch(':id/unblock')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Unblock client (Admin only)' })
  @ApiResponse({ status: 200, description: 'Client successfully unblocked' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async unblock(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.clientsService.unblock(id, userId, userRole);
  }

  @Patch(':id/suspend')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Suspend client (Admin only)' })
  @ApiResponse({ status: 200, description: 'Client successfully suspended' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async suspend(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.clientsService.suspend(id, userId, userRole);
  }

  @Patch(':id/unsuspend')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Unsuspend client (Admin only)' })
  @ApiResponse({ status: 200, description: 'Client successfully unsuspended' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async unsuspend(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.clientsService.unsuspend(id, userId, userRole);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete client (Admin only)' })
  @ApiResponse({ status: 200, description: 'Client successfully deleted' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.clientsService.delete(id, userId, userRole);
  }

  // Template management endpoints (Admin only)
  @Get(':id/templates')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get client templates (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of client templates' })
  async getClientTemplates(@Param('id') clientId: string) {
    return this.clientsService.getClientTemplates(clientId);
  }

  @Post(':id/templates')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign template to client (Admin only)' })
  @ApiResponse({ status: 201, description: 'Template successfully assigned' })
  async assignTemplate(
    @Param('id') clientId: string,
    @Body() body: { templateId: string; customName?: string },
  ) {
    return this.clientsService.assignTemplate(
      clientId,
      body.templateId,
      body.customName,
    );
  }

  @Patch(':id/templates/:templateId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update client template (Admin only)' })
  @ApiResponse({ status: 200, description: 'Template successfully updated' })
  async updateClientTemplate(
    @Param('id') clientId: string,
    @Param('templateId') templateId: string,
    @Body() body: { customName?: string; isActive?: boolean },
  ) {
    return this.clientsService.updateClientTemplate(clientId, templateId, body);
  }

  @Delete(':id/templates/:templateId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove template from client (Admin only)' })
  @ApiResponse({ status: 200, description: 'Template successfully removed' })
  async removeTemplate(
    @Param('id') clientId: string,
    @Param('templateId') templateId: string,
  ) {
    return this.clientsService.removeTemplate(clientId, templateId);
  }
}
