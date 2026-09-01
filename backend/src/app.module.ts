import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { LicensesModule } from './licenses/licenses.module';
import { PluginsModule } from './plugins/plugins.module';
import { ProjectsModule } from './projects/projects.module';
import { BuildsModule } from './builds/builds.module';
import { UploadModule } from './upload/upload.module';
import { ScreenshotsModule } from './screenshots/screenshots.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute
      },
    ]),
    PrismaModule,
    AuthModule,
    ClientsModule,
    LicensesModule,
    PluginsModule,
    ProjectsModule,
    BuildsModule,
    UploadModule,
    ScreenshotsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
