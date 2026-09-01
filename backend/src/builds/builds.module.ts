import { Module } from '@nestjs/common';
import { BuildsService } from './builds.service';
import { BuildsController } from './builds.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BuildsController],
  providers: [BuildsService],
  exports: [BuildsService],
})
export class BuildsModule {}
