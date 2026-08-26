import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, Ip } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiHeader } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { LicensesService } from './licenses.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { HmacAuthGuard } from '../common/guards/hmac-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateLicenseDto } from './dto/create-license.dto';
import { ValidateLicenseDto } from './dto/validate-license.dto';
import { ActivateLicenseDto } from './dto/activate-license.dto';
import { DeactivateLicenseDto } from './dto/deactivate-license.dto';
import { UpdateLicenseStatusDto } from './dto/update-license-status.dto';
import { UserRole } from '@prisma/client';

@ApiTags('licenses')
@Controller('licenses')
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Post('validate')
  @UseGuards(HmacAuthGuard)
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiOperation({ summary: 'Validate a license key' })
  @ApiHeader({ name: 'x-api-key', description: 'API key for HMAC authentication' })
  @ApiHeader({ name: 'x-timestamp', description: 'Unix timestamp for request' })
  @ApiHeader({ name: 'x-signature', description: 'HMAC-SHA256 signature' })
  @ApiResponse({ status: 200, description: 'License validation result' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid authentication' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async validateLicense(@Body() dto: ValidateLicenseDto, @Ip() ipAddress?: string) {
    return this.licensesService.validateLicense(dto, ipAddress || null);
  }

  @Post('activate')
  @UseGuards(HmacAuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Activate a license for a domain' })
  @ApiHeader({ name: 'x-api-key', description: 'API key for HMAC authentication' })
  @ApiHeader({ name: 'x-timestamp', description: 'Unix timestamp for request' })
  @ApiHeader({ name: 'x-signature', description: 'HMAC-SHA256 signature' })
  @ApiResponse({ status: 201, description: 'License activated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request or activation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid authentication' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async activateLicense(@Body() dto: ActivateLicenseDto, @Ip() ipAddress?: string) {
    return this.licensesService.activateLicense(dto, ipAddress || null);
  }

  @Post('deactivate')
  @UseGuards(HmacAuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Deactivate a license for a domain' })
  @ApiHeader({ name: 'x-api-key', description: 'API key for HMAC authentication' })
  @ApiHeader({ name: 'x-timestamp', description: 'Unix timestamp for request' })
  @ApiHeader({ name: 'x-signature', description: 'HMAC-SHA256 signature' })
  @ApiResponse({ status: 200, description: 'License deactivated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request or deactivation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid authentication' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async deactivateLicense(@Body() dto: DeactivateLicenseDto, @Ip() ipAddress?: string) {
    return this.licensesService.deactivateLicense(dto, ipAddress || null);
  }

  @Post('admin/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate a license for a domain (Admin only)' })
  @ApiResponse({ status: 200, description: 'License deactivated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request or deactivation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async adminDeactivateLicense(@Body() dto: DeactivateLicenseDto, @Ip() ipAddress?: string) {
    return this.licensesService.deactivateLicense(dto, ipAddress || null);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all licenses (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all licenses' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async getAllLicenses() {
    return this.licensesService.getAllLicenses();
  }

  @Get('my-licenses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current client licenses' })
  @ApiResponse({ status: 200, description: 'List of client licenses' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyLicenses(@Request() req) {
    const client = await this.licensesService['prisma'].client.findFirst({
      where: { userId: req.user.id },
    });
    
    if (!client) {
      return [];
    }
    
    return this.licensesService.getClientLicenses(client.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get license by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'License ID' })
  @ApiResponse({ status: 200, description: 'License details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'License not found' })
  async getLicenseById(@Param('id') id: string) {
    return this.licensesService.getLicenseById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new license (Admin only)' })
  @ApiResponse({ status: 201, description: 'License created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async createLicense(@Body() dto: CreateLicenseDto, @Ip() ipAddress?: string) {
    return this.licensesService.createLicense(dto, ipAddress || null);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update license status (Admin only)' })
  @ApiParam({ name: 'id', description: 'License ID' })
  @ApiResponse({ status: 200, description: 'License status updated' })
  @ApiResponse({ status: 400, description: 'Invalid request or invalid status transition' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'License not found' })
  async updateLicenseStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLicenseStatusDto,
    @Ip() ipAddress?: string,
  ) {
    return this.licensesService.updateLicenseStatus(id, dto, ipAddress || null);
  }

  @Post(':id/unblock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unblock a license (Admin only)' })
  @ApiParam({ name: 'id', description: 'License ID' })
  @ApiResponse({ status: 200, description: 'License unblocked successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request or license cannot be unblocked' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'License not found' })
  async unblockLicense(@Param('id') id: string, @Ip() ipAddress?: string) {
    return this.licensesService.unblockLicense(id, ipAddress || null);
  }

  @Get(':id/activations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get license activations (Admin only)' })
  @ApiParam({ name: 'id', description: 'License ID' })
  @ApiResponse({ status: 200, description: 'List of license activations' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'License not found' })
  async getLicenseActivations(@Param('id') id: string) {
    return this.licensesService.getLicenseActivations(id);
  }

  @Get(':id/logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get license logs (Admin only)' })
  @ApiParam({ name: 'id', description: 'License ID' })
  @ApiResponse({ status: 200, description: 'List of license logs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'License not found' })
  async getLicenseLogs(@Param('id') id: string) {
    return this.licensesService.getLicenseLogs(id);
  }
}