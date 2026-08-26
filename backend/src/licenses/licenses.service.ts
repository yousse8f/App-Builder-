import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LicenseType, LicenseStatus, ActivationStatus, LicenseLogAction } from '@prisma/client';
import { generateLicenseKey, validateLicenseKeyFormat, getLicenseTypeFromKey } from './license-key-generator.util';
import { CreateLicenseDto } from './dto/create-license.dto';
import { ValidateLicenseDto } from './dto/validate-license.dto';
import { ActivateLicenseDto } from './dto/activate-license.dto';
import { DeactivateLicenseDto } from './dto/deactivate-license.dto';
import { UpdateLicenseStatusDto } from './dto/update-license-status.dto';
import { LicenseValidationResponseDto, LicenseActivationResponseDto, LicenseErrorCodes } from './dto/license-response.dto';

@Injectable()
export class LicensesService {
  constructor(private prisma: PrismaService) {}

  async createLicense(dto: CreateLicenseDto, ipAddress?: string | null) {
    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId },
      include: { user: true },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (client.status !== 'ACTIVE') {
      throw new BadRequestException('Client is not active');
    }

    const existingLicense = await this.prisma.license.findFirst({
      where: {
        clientId: dto.clientId,
        type: dto.type,
        status: { in: [LicenseStatus.ACTIVE, LicenseStatus.SUSPENDED] },
      },
    });

    if (existingLicense) {
      throw new ConflictException(`Client already has an active ${dto.type} license`);
    }

    const licenseKey = generateLicenseKey(dto.type);

    const license = await this.prisma.license.create({
      data: {
        key: licenseKey,
        type: dto.type,
        clientId: dto.clientId,
        domain: dto.domain,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        activationLimit: dto.activationLimit || 1,
      },
    });

    await this.logLicenseAction(license.id, LicenseLogAction.CREATE, null, ipAddress || null, 'SUCCESS');

    return license;
  }

  async validateLicense(dto: ValidateLicenseDto, ipAddress?: string | null): Promise<LicenseValidationResponseDto> {
    const license = await this.prisma.license.findUnique({
      where: { key: dto.licenseKey },
      include: {
        client: {
          include: { user: true },
        },
        activations: {
          where: { status: ActivationStatus.ACTIVE },
        },
      },
    });

    if (!license) {
      return {
        valid: false,
        errorCode: LicenseErrorCodes.LICENSE_NOT_FOUND,
        error: 'License not found',
      };
    }

    if (license.type !== dto.type) {
      await this.logLicenseAction(license.id, LicenseLogAction.VALIDATE, dto.domain, ipAddress || null, LicenseErrorCodes.INVALID_LICENSE_TYPE);
      return {
        valid: false,
        errorCode: LicenseErrorCodes.INVALID_LICENSE_TYPE,
        error: 'Invalid license type',
      };
    }

    if (license.client.status !== 'ACTIVE') {
      await this.logLicenseAction(license.id, LicenseLogAction.VALIDATE, dto.domain, ipAddress || null, LicenseErrorCodes.CLIENT_BLOCKED);
      return {
        valid: false,
        errorCode: LicenseErrorCodes.CLIENT_BLOCKED,
        error: 'Client is blocked or suspended',
      };
    }

    if (license.status === LicenseStatus.BLOCKED) {
      await this.logLicenseAction(license.id, LicenseLogAction.VALIDATE, dto.domain, ipAddress || null, LicenseErrorCodes.LICENSE_BLOCKED);
      return {
        valid: false,
        errorCode: LicenseErrorCodes.LICENSE_BLOCKED,
        error: 'License is blocked',
      };
    }

    if (license.status === LicenseStatus.SUSPENDED) {
      await this.logLicenseAction(license.id, LicenseLogAction.VALIDATE, dto.domain, ipAddress || null, LicenseErrorCodes.LICENSE_SUSPENDED);
      return {
        valid: false,
        errorCode: LicenseErrorCodes.LICENSE_SUSPENDED,
        error: 'License is suspended',
      };
    }

    if (license.expiresAt && new Date() > license.expiresAt) {
      await this.prisma.license.update({
        where: { id: license.id },
        data: { status: LicenseStatus.EXPIRED },
      });
      await this.logLicenseAction(license.id, LicenseLogAction.VALIDATE, dto.domain, ipAddress || null, LicenseErrorCodes.LICENSE_EXPIRED);
      return {
        valid: false,
        errorCode: LicenseErrorCodes.LICENSE_EXPIRED,
        error: 'License has expired',
      };
    }

    if (license.status === LicenseStatus.EXPIRED) {
      await this.logLicenseAction(license.id, LicenseLogAction.VALIDATE, dto.domain, ipAddress || null, LicenseErrorCodes.LICENSE_EXPIRED);
      return {
        valid: false,
        errorCode: LicenseErrorCodes.LICENSE_EXPIRED,
        error: 'License has expired',
      };
    }

    if (license.status !== LicenseStatus.ACTIVE) {
      await this.logLicenseAction(license.id, LicenseLogAction.VALIDATE, dto.domain, ipAddress || null, LicenseErrorCodes.LICENSE_INACTIVE);
      return {
        valid: false,
        errorCode: LicenseErrorCodes.LICENSE_INACTIVE,
        error: 'License is not active',
      };
    }

    const domainActivation = license.activations.find(a => a.domain === dto.domain);
    if (!domainActivation) {
      await this.logLicenseAction(license.id, LicenseLogAction.VALIDATE, dto.domain, ipAddress || null, LicenseErrorCodes.INVALID_DOMAIN);
      return {
        valid: false,
        errorCode: LicenseErrorCodes.INVALID_DOMAIN,
        error: 'Domain is not activated for this license',
      };
    }

    await this.prisma.licenseActivation.update({
      where: { id: domainActivation.id },
      data: { lastValidatedAt: new Date() },
    });

    await this.logLicenseAction(license.id, LicenseLogAction.VALIDATE, dto.domain, ipAddress || null, 'SUCCESS');

    return {
      valid: true,
      status: license.status,
      type: license.type,
      expiresAt: license.expiresAt,
    };
  }

  async activateLicense(dto: ActivateLicenseDto, ipAddress?: string | null): Promise<LicenseActivationResponseDto> {
    const license = await this.prisma.license.findUnique({
      where: { key: dto.licenseKey },
      include: {
        client: {
          include: { user: true },
        },
        activations: {
          where: { status: ActivationStatus.ACTIVE },
        },
      },
    });

    if (!license) {
      return {
        success: false,
        message: 'License not found',
        error: 'License not found',
        errorCode: LicenseErrorCodes.LICENSE_NOT_FOUND,
      };
    }

    if (license.type !== dto.type) {
      await this.logLicenseAction(license.id, LicenseLogAction.ACTIVATE, dto.domain, ipAddress || null, LicenseErrorCodes.INVALID_LICENSE_TYPE);
      return {
        success: false,
        message: 'Invalid license type',
        error: 'Invalid license type',
        errorCode: LicenseErrorCodes.INVALID_LICENSE_TYPE,
      };
    }

    if (license.client.status !== 'ACTIVE') {
      await this.logLicenseAction(license.id, LicenseLogAction.ACTIVATE, dto.domain, ipAddress || null, LicenseErrorCodes.CLIENT_BLOCKED);
      return {
        success: false,
        message: 'Client is blocked or suspended',
        error: 'Client is blocked or suspended',
        errorCode: LicenseErrorCodes.CLIENT_BLOCKED,
      };
    }

    if (license.status !== LicenseStatus.ACTIVE) {
      await this.logLicenseAction(license.id, LicenseLogAction.ACTIVATE, dto.domain, ipAddress || null, LicenseErrorCodes.LICENSE_NOT_ACTIVE);
      return {
        success: false,
        message: 'License is not active',
        error: 'License is not active',
        errorCode: LicenseErrorCodes.LICENSE_NOT_ACTIVE,
      };
    }

    if (license.expiresAt && new Date() > license.expiresAt) {
      await this.prisma.license.update({
        where: { id: license.id },
        data: { status: LicenseStatus.EXPIRED },
      });
      await this.logLicenseAction(license.id, LicenseLogAction.ACTIVATE, dto.domain, ipAddress || null, LicenseErrorCodes.LICENSE_EXPIRED);
      return {
        success: false,
        message: 'License has expired',
        error: 'License has expired',
        errorCode: LicenseErrorCodes.LICENSE_EXPIRED,
      };
    }

    const existingActivation = license.activations.find(a => a.domain === dto.domain);
    if (existingActivation) {
      await this.logLicenseAction(license.id, LicenseLogAction.ACTIVATE, dto.domain, ipAddress || null, LicenseErrorCodes.DOMAIN_ALREADY_ACTIVATED);
      return {
        success: false,
        message: 'Domain is already activated for this license',
        error: 'Domain is already activated for this license',
        errorCode: LicenseErrorCodes.DOMAIN_ALREADY_ACTIVATED,
      };
    }

    if (license.activations.length >= license.activationLimit) {
      await this.logLicenseAction(license.id, LicenseLogAction.ACTIVATE, dto.domain, ipAddress || null, LicenseErrorCodes.ACTIVATION_LIMIT_REACHED);
      return {
        success: false,
        message: 'Activation limit reached',
        error: 'Activation limit reached',
        errorCode: LicenseErrorCodes.ACTIVATION_LIMIT_REACHED,
      };
    }

    const activation = await this.prisma.licenseActivation.create({
      data: {
        licenseId: license.id,
        domain: dto.domain,
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,
      },
    });

    await this.prisma.license.update({
      where: { id: license.id },
      data: { activationCount: license.activationCount + 1 },
    });

    await this.logLicenseAction(license.id, LicenseLogAction.ACTIVATE, dto.domain, ipAddress || null, 'SUCCESS');

    return {
      success: true,
      message: 'License activated successfully',
      activation: {
        id: activation.id,
        domain: activation.domain,
        activatedAt: activation.activatedAt,
      },
    };
  }

  async deactivateLicense(dto: DeactivateLicenseDto, ipAddress?: string | null): Promise<LicenseActivationResponseDto> {
    const license = await this.prisma.license.findUnique({
      where: { key: dto.licenseKey },
      include: {
        activations: {
          where: { 
            domain: dto.domain,
            status: ActivationStatus.ACTIVE,
          },
        },
      },
    });

    if (!license) {
      return {
        success: false,
        message: 'License not found',
        error: 'License not found',
        errorCode: LicenseErrorCodes.LICENSE_NOT_FOUND,
      };
    }

    const activation = license.activations[0];
    if (!activation) {
      await this.logLicenseAction(license.id, LicenseLogAction.DEACTIVATE, dto.domain, ipAddress || null, LicenseErrorCodes.ACTIVATION_NOT_FOUND);
      return {
        success: false,
        message: 'Activation not found for this domain',
        error: 'Activation not found for this domain',
        errorCode: LicenseErrorCodes.ACTIVATION_NOT_FOUND,
      };
    }

    await this.prisma.licenseActivation.update({
      where: { id: activation.id },
      data: { status: ActivationStatus.INACTIVE },
    });

    await this.prisma.license.update({
      where: { id: license.id },
      data: { activationCount: Math.max(0, license.activationCount - 1) },
    });

    await this.logLicenseAction(license.id, LicenseLogAction.DEACTIVATE, dto.domain, ipAddress || null, 'SUCCESS');

    return {
      success: true,
      message: 'License deactivated successfully',
    };
  }

  async updateLicenseStatus(licenseId: string, dto: UpdateLicenseStatusDto, ipAddress?: string | null) {
    const license = await this.prisma.license.findUnique({
      where: { id: licenseId },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    const validTransitions: Record<LicenseStatus, LicenseStatus[]> = {
      [LicenseStatus.ACTIVE]: [LicenseStatus.SUSPENDED, LicenseStatus.BLOCKED, LicenseStatus.INACTIVE],
      [LicenseStatus.SUSPENDED]: [LicenseStatus.ACTIVE, LicenseStatus.BLOCKED, LicenseStatus.INACTIVE],
      [LicenseStatus.BLOCKED]: [LicenseStatus.ACTIVE, LicenseStatus.INACTIVE],
      [LicenseStatus.INACTIVE]: [LicenseStatus.ACTIVE],
      [LicenseStatus.EXPIRED]: [],
    };

    if (!validTransitions[license.status].includes(dto.status)) {
      throw new BadRequestException(`Cannot transition from ${license.status} to ${dto.status}`);
    }

    let action: LicenseLogAction;
    switch (dto.status) {
      case LicenseStatus.SUSPENDED:
        action = LicenseLogAction.SUSPEND;
        break;
      case LicenseStatus.ACTIVE:
        action = LicenseLogAction.REACTIVATE;
        break;
      case LicenseStatus.BLOCKED:
        action = LicenseLogAction.BLOCK;
        break;
      case LicenseStatus.INACTIVE:
        action = LicenseLogAction.REVOKE;
        break;
      default:
        action = LicenseLogAction.VALIDATE;
    }

    const updatedLicense = await this.prisma.license.update({
      where: { id: licenseId },
      data: { status: dto.status },
    });

    await this.logLicenseAction(licenseId, action, null, ipAddress || null, 'SUCCESS');

    return updatedLicense;
  }

  async unblockLicense(licenseId: string, ipAddress?: string | null) {
    const license = await this.prisma.license.findUnique({
      where: { id: licenseId },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    if (license.status !== LicenseStatus.BLOCKED) {
      throw new BadRequestException('Only blocked licenses can be unblocked');
    }

    const updatedLicense = await this.prisma.license.update({
      where: { id: licenseId },
      data: { status: LicenseStatus.ACTIVE },
    });

    await this.logLicenseAction(licenseId, LicenseLogAction.UNBLOCK, null, ipAddress || null, 'SUCCESS');

    return updatedLicense;
  }

  async getAllLicenses() {
    return this.prisma.license.findMany({
      include: {
        client: {
          include: { user: true },
        },
        activations: {
          where: { status: ActivationStatus.ACTIVE },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLicenseById(id: string) {
    const license = await this.prisma.license.findUnique({
      where: { id },
      include: {
        client: {
          include: { user: true },
        },
        activations: {
          orderBy: { createdAt: 'desc' },
        },
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    return license;
  }

  async getClientLicenses(clientId: string) {
    return this.prisma.license.findMany({
      where: { clientId },
      include: {
        activations: {
          where: { status: ActivationStatus.ACTIVE },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLicenseActivations(licenseId: string) {
    const license = await this.prisma.license.findUnique({
      where: { id: licenseId },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    return this.prisma.licenseActivation.findMany({
      where: { licenseId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLicenseLogs(licenseId: string) {
    const license = await this.prisma.license.findUnique({
      where: { id: licenseId },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    return this.prisma.licenseLog.findMany({
      where: { licenseId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  private async logLicenseAction(
    licenseId: string | null,
    action: LicenseLogAction,
    domain: string | null,
    ipAddress: string | null,
    result: string,
    metadata?: string,
  ) {
    if (!licenseId) {
      return;
    }

    await this.prisma.licenseLog.create({
      data: {
        licenseId,
        action,
        domain,
        ipAddress,
        result,
        metadata,
      },
    });
  }
}