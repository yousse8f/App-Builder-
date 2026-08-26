import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { LicensesService } from './licenses.service';
import { PrismaService } from '../prisma/prisma.service';
import { LicenseType, LicenseStatus, ActivationStatus, LicenseLogAction } from '@prisma/client';
import { CreateLicenseDto } from './dto/create-license.dto';
import { ValidateLicenseDto } from './dto/validate-license.dto';
import { ActivateLicenseDto } from './dto/activate-license.dto';
import { DeactivateLicenseDto } from './dto/deactivate-license.dto';
import { UpdateLicenseStatusDto } from './dto/update-license-status.dto';
import { LicenseErrorCodes } from './dto/license-response.dto';

describe('LicensesService', () => {
  let service: LicensesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    client: {
      findUnique: jest.fn(),
    },
    license: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    licenseActivation: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    licenseLog: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LicensesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LicensesService>(LicensesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createLicense', () => {
    it('should create a license successfully', async () => {
      const dto: CreateLicenseDto = {
        type: LicenseType.PLUGIN,
        clientId: 'client123',
        domain: 'example.com',
        expiresAt: '2026-12-31',
        activationLimit: 3,
      };

      const mockClient = {
        id: 'client123',
        companyName: 'Test Client',
        status: 'ACTIVE',
        user: { id: 'user123', email: 'test@example.com' },
      };

      const mockLicense = {
        id: 'license123',
        key: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        status: LicenseStatus.ACTIVE,
        clientId: 'client123',
        domain: 'example.com',
        expiresAt: new Date('2026-12-31'),
        activationLimit: 3,
        activationCount: 0,
      };

      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);
      mockPrismaService.license.findFirst.mockResolvedValue(null);
      mockPrismaService.license.create.mockResolvedValue(mockLicense);
      mockPrismaService.licenseLog.create.mockResolvedValue({});

      const result = await service.createLicense(dto, '192.168.1.1');

      expect(result).toEqual(mockLicense);
      expect(mockPrismaService.license.create).toHaveBeenCalledWith({
        data: {
          key: expect.stringMatching(/^PLG-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/),
          type: LicenseType.PLUGIN,
          clientId: 'client123',
          domain: 'example.com',
          expiresAt: new Date('2026-12-31'),
          activationLimit: 3,
        },
      });
    });

    it('should throw NotFoundException if client not found', async () => {
      const dto: CreateLicenseDto = {
        type: LicenseType.PLUGIN,
        clientId: 'nonexistent',
      };

      mockPrismaService.client.findUnique.mockResolvedValue(null);

      await expect(service.createLicense(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if client is not active', async () => {
      const dto: CreateLicenseDto = {
        type: LicenseType.PLUGIN,
        clientId: 'client123',
      };

      const mockClient = {
        id: 'client123',
        status: 'BLOCKED',
        user: { id: 'user123' },
      };

      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);

      await expect(service.createLicense(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if client already has active license of same type', async () => {
      const dto: CreateLicenseDto = {
        type: LicenseType.PLUGIN,
        clientId: 'client123',
      };

      const mockClient = {
        id: 'client123',
        status: 'ACTIVE',
        user: { id: 'user123' },
      };

      const existingLicense = {
        id: 'existing123',
        type: LicenseType.PLUGIN,
        status: LicenseStatus.ACTIVE,
      };

      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);
      mockPrismaService.license.findFirst.mockResolvedValue(existingLicense);

      await expect(service.createLicense(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('validateLicense', () => {
    it('should validate a valid license successfully', async () => {
      const dto: ValidateLicenseDto = {
        licenseKey: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        domain: 'example.com',
      };

      const mockLicense = {
        id: 'license123',
        key: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        status: LicenseStatus.ACTIVE,
        expiresAt: new Date('2026-12-31'),
        client: {
          status: 'ACTIVE',
          user: { id: 'user123' },
        },
        activations: [
          {
            domain: 'example.com',
            status: ActivationStatus.ACTIVE,
          },
        ],
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.licenseActivation.update.mockResolvedValue({});
      mockPrismaService.licenseLog.create.mockResolvedValue({});

      const result = await service.validateLicense(dto, '192.168.1.1');

      expect(result.valid).toBe(true);
      expect(result.status).toBe(LicenseStatus.ACTIVE);
      expect(result.type).toBe(LicenseType.PLUGIN);
    });

    it('should return LICENSE_NOT_FOUND for non-existent license', async () => {
      const dto: ValidateLicenseDto = {
        licenseKey: 'INVALID-KEY',
        type: LicenseType.PLUGIN,
        domain: 'example.com',
      };

      mockPrismaService.license.findUnique.mockResolvedValue(null);

      const result = await service.validateLicense(dto);

      expect(result.valid).toBe(false);
      expect(result.errorCode).toBe(LicenseErrorCodes.LICENSE_NOT_FOUND);
    });

    it('should return INVALID_LICENSE_TYPE for type mismatch', async () => {
      const dto: ValidateLicenseDto = {
        licenseKey: 'PLG-TEST-TEST-TEST',
        type: LicenseType.BUILDER,
        domain: 'example.com',
      };

      const mockLicense = {
        id: 'license123',
        key: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        status: LicenseStatus.ACTIVE,
        client: { status: 'ACTIVE', user: {} },
        activations: [],
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.licenseLog.create.mockResolvedValue({});

      const result = await service.validateLicense(dto);

      expect(result.valid).toBe(false);
      expect(result.errorCode).toBe(LicenseErrorCodes.INVALID_LICENSE_TYPE);
    });

    it('should return CLIENT_BLOCKED for blocked client', async () => {
      const dto: ValidateLicenseDto = {
        licenseKey: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        domain: 'example.com',
      };

      const mockLicense = {
        id: 'license123',
        key: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        status: LicenseStatus.ACTIVE,
        client: { status: 'BLOCKED', user: {} },
        activations: [],
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.licenseLog.create.mockResolvedValue({});

      const result = await service.validateLicense(dto);

      expect(result.valid).toBe(false);
      expect(result.errorCode).toBe(LicenseErrorCodes.CLIENT_BLOCKED);
    });

    it('should return LICENSE_BLOCKED for blocked license', async () => {
      const dto: ValidateLicenseDto = {
        licenseKey: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        domain: 'example.com',
      };

      const mockLicense = {
        id: 'license123',
        key: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        status: LicenseStatus.BLOCKED,
        client: { status: 'ACTIVE', user: {} },
        activations: [],
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.licenseLog.create.mockResolvedValue({});

      const result = await service.validateLicense(dto);

      expect(result.valid).toBe(false);
      expect(result.errorCode).toBe(LicenseErrorCodes.LICENSE_BLOCKED);
    });

    it('should return LICENSE_EXPIRED for expired license', async () => {
      const dto: ValidateLicenseDto = {
        licenseKey: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        domain: 'example.com',
      };

      const mockLicense = {
        id: 'license123',
        key: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        status: LicenseStatus.ACTIVE,
        expiresAt: new Date('2020-01-01'),
        client: { status: 'ACTIVE', user: {} },
        activations: [],
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.license.update.mockResolvedValue({});
      mockPrismaService.licenseLog.create.mockResolvedValue({});

      const result = await service.validateLicense(dto);

      expect(result.valid).toBe(false);
      expect(result.errorCode).toBe(LicenseErrorCodes.LICENSE_EXPIRED);
    });

    it('should return INVALID_DOMAIN for non-activated domain', async () => {
      const dto: ValidateLicenseDto = {
        licenseKey: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        domain: 'example.com',
      };

      const mockLicense = {
        id: 'license123',
        key: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        status: LicenseStatus.ACTIVE,
        client: { status: 'ACTIVE', user: {} },
        activations: [
          { domain: 'otherdomain.com', status: ActivationStatus.ACTIVE },
        ],
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.licenseLog.create.mockResolvedValue({});

      const result = await service.validateLicense(dto);

      expect(result.valid).toBe(false);
      expect(result.errorCode).toBe(LicenseErrorCodes.INVALID_DOMAIN);
    });
  });

  describe('activateLicense', () => {
    it('should activate a license successfully', async () => {
      const dto: ActivateLicenseDto = {
        licenseKey: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        domain: 'example.com',
      };

      const mockLicense = {
        id: 'license123',
        key: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        status: LicenseStatus.ACTIVE,
        expiresAt: new Date('2026-12-31'),
        activationLimit: 3,
        activationCount: 0,
        client: { status: 'ACTIVE', user: {} },
        activations: [],
      };

      const mockActivation = {
        id: 'activation123',
        domain: 'example.com',
        activatedAt: new Date(),
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.licenseActivation.create.mockResolvedValue(mockActivation);
      mockPrismaService.license.update.mockResolvedValue({});
      mockPrismaService.licenseLog.create.mockResolvedValue({});

      const result = await service.activateLicense(dto, '192.168.1.1');

      expect(result.success).toBe(true);
      expect(result.activation).toEqual({
        id: 'activation123',
        domain: 'example.com',
        activatedAt: expect.any(Date),
      });
    });

    it('should return ACTIVATION_LIMIT_REACHED when limit exceeded', async () => {
      const dto: ActivateLicenseDto = {
        licenseKey: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        domain: 'example.com',
      };

      const mockLicense = {
        id: 'license123',
        key: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        status: LicenseStatus.ACTIVE,
        activationLimit: 1,
        activationCount: 1,
        client: { status: 'ACTIVE', user: {} },
        activations: [
          { domain: 'otherdomain.com', status: ActivationStatus.ACTIVE },
        ],
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.licenseLog.create.mockResolvedValue({});

      const result = await service.activateLicense(dto);

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe(LicenseErrorCodes.ACTIVATION_LIMIT_REACHED);
    });

    it('should return DOMAIN_ALREADY_ACTIVATED for duplicate activation', async () => {
      const dto: ActivateLicenseDto = {
        licenseKey: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        domain: 'example.com',
      };

      const mockLicense = {
        id: 'license123',
        key: 'PLG-TEST-TEST-TEST',
        type: LicenseType.PLUGIN,
        status: LicenseStatus.ACTIVE,
        activationLimit: 3,
        client: { status: 'ACTIVE', user: {} },
        activations: [
          { domain: 'example.com', status: ActivationStatus.ACTIVE },
        ],
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.licenseLog.create.mockResolvedValue({});

      const result = await service.activateLicense(dto);

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe(LicenseErrorCodes.DOMAIN_ALREADY_ACTIVATED);
    });
  });

  describe('deactivateLicense', () => {
    it('should deactivate a license successfully', async () => {
      const dto: DeactivateLicenseDto = {
        licenseKey: 'PLG-TEST-TEST-TEST',
        domain: 'example.com',
      };

      const mockLicense = {
        id: 'license123',
        key: 'PLG-TEST-TEST-TEST',
        activationCount: 1,
        activations: [
          {
            id: 'activation123',
            domain: 'example.com',
            status: ActivationStatus.ACTIVE,
          },
        ],
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.licenseActivation.update.mockResolvedValue({});
      mockPrismaService.license.update.mockResolvedValue({});
      mockPrismaService.licenseLog.create.mockResolvedValue({});

      const result = await service.deactivateLicense(dto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('License deactivated successfully');
    });

    it('should return ACTIVATION_NOT_FOUND for non-existent activation', async () => {
      const dto: DeactivateLicenseDto = {
        licenseKey: 'PLG-TEST-TEST-TEST',
        domain: 'example.com',
      };

      const mockLicense = {
        id: 'license123',
        key: 'PLG-TEST-TEST-TEST',
        activations: [],
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.licenseLog.create.mockResolvedValue({});

      const result = await service.deactivateLicense(dto);

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe(LicenseErrorCodes.ACTIVATION_NOT_FOUND);
    });
  });

  describe('updateLicenseStatus', () => {
    it('should update license status successfully', async () => {
      const mockLicense = {
        id: 'license123',
        status: LicenseStatus.ACTIVE,
      };

      const dto: UpdateLicenseStatusDto = {
        status: LicenseStatus.SUSPENDED,
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.license.update.mockResolvedValue({
        ...mockLicense,
        status: LicenseStatus.SUSPENDED,
      });
      mockPrismaService.licenseLog.create.mockResolvedValue({});

      const result = await service.updateLicenseStatus('license123', dto);

      expect(result.status).toBe(LicenseStatus.SUSPENDED);
    });

    it('should throw BadRequestException for invalid status transition', async () => {
      const mockLicense = {
        id: 'license123',
        status: LicenseStatus.EXPIRED,
      };

      const dto: UpdateLicenseStatusDto = {
        status: LicenseStatus.ACTIVE,
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);

      await expect(service.updateLicenseStatus('license123', dto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('unblockLicense', () => {
    it('should unblock a blocked license successfully', async () => {
      const mockLicense = {
        id: 'license123',
        status: LicenseStatus.BLOCKED,
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);
      mockPrismaService.license.update.mockResolvedValue({
        ...mockLicense,
        status: LicenseStatus.ACTIVE,
      });
      mockPrismaService.licenseLog.create.mockResolvedValue({});

      const result = await service.unblockLicense('license123');

      expect(result.status).toBe(LicenseStatus.ACTIVE);
    });

    it('should throw BadRequestException when unblocking non-blocked license', async () => {
      const mockLicense = {
        id: 'license123',
        status: LicenseStatus.ACTIVE,
      };

      mockPrismaService.license.findUnique.mockResolvedValue(mockLicense);

      await expect(service.unblockLicense('license123')).rejects.toThrow(BadRequestException);
    });
  });
});