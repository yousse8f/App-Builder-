import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LicensesService } from './licenses.service';
import { LicensesController } from './licenses.controller';
import { LicenseExpirationScheduler } from './license-expiration.scheduler';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],
  controllers: [LicensesController],
  providers: [LicensesService, LicenseExpirationScheduler],
  exports: [LicensesService],
})
export class LicensesModule {}
