import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { LicenseStatus } from '@prisma/client';

@Injectable()
export class LicenseExpirationScheduler {
  private readonly logger = new Logger(LicenseExpirationScheduler.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleLicenseExpiration() {
    this.logger.log('Starting license expiration check...');

    try {
      const now = new Date();

      // Find all active licenses that have expired
      const expiredLicenses = await this.prisma.license.findMany({
        where: {
          status: LicenseStatus.ACTIVE,
          expiresAt: {
            lte: now,
          },
        },
      });

      if (expiredLicenses.length === 0) {
        this.logger.log('No expired licenses found.');
        return;
      }

      this.logger.log(
        `Found ${expiredLicenses.length} expired licenses. Updating status...`,
      );

      // Update all expired licenses to EXPIRED status
      const updatedLicenses = await this.prisma.license.updateMany({
        where: {
          id: {
            in: expiredLicenses.map((license) => license.id),
          },
        },
        data: {
          status: LicenseStatus.EXPIRED,
        },
      });

      this.logger.log(
        `Successfully updated ${updatedLicenses.count} licenses to EXPIRED status.`,
      );

      // Log expiration for each license
      for (const license of expiredLicenses) {
        await this.prisma.licenseLog.create({
          data: {
            licenseId: license.id,
            action: 'EXPIRE',
            result: 'SUCCESS',
            metadata: `License expired automatically at ${now.toISOString()}`,
          },
        });
      }
    } catch (error) {
      this.logger.error('Error during license expiration check:', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyLicenseReport() {
    this.logger.log('Generating daily license report...');

    try {
      const stats = {
        total: await this.prisma.license.count(),
        active: await this.prisma.license.count({
          where: { status: LicenseStatus.ACTIVE },
        }),
        expired: await this.prisma.license.count({
          where: { status: LicenseStatus.EXPIRED },
        }),
        suspended: await this.prisma.license.count({
          where: { status: LicenseStatus.SUSPENDED },
        }),
        blocked: await this.prisma.license.count({
          where: { status: LicenseStatus.BLOCKED },
        }),
        inactive: await this.prisma.license.count({
          where: { status: LicenseStatus.INACTIVE },
        }),
      };

      this.logger.log(`Daily License Report: ${JSON.stringify(stats)}`);
    } catch (error) {
      this.logger.error('Error generating daily license report:', error);
    }
  }
}
