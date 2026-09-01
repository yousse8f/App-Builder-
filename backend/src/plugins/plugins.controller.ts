import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';
import { PluginsService } from './plugins.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import type { Response } from 'express';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'plugins');

@ApiTags('Plugins')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('plugins')
export class PluginsController {
  constructor(private readonly pluginsService: PluginsService) {}

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.pluginsService.findAll({ id: userId, role: userRole });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.pluginsService.findOne(id, { id: userId, role: userRole });
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() dto: CreatePluginDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.pluginsService.create(dto, { id: userId, role: userRole });
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePluginDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.pluginsService.update(id, dto, { id: userId, role: userRole });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.pluginsService.remove(id, { id: userId, role: userRole });
  }

  @Post(':id/activate')
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  async activate(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.pluginsService.activate(id, { id: userId, role: userRole });
  }

  @Post(':id/deactivate')
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  async deactivate(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.pluginsService.deactivate(id, { id: userId, role: userRole });
  }

  // Upload plugin binary/package
  @Post(':id/upload')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (_req, file, cb) => {
          const name = file.originalname
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9-_.]/g, '');
          cb(null, `${Date.now()}-${name}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // allow common archive/package types
        const allowed = ['.zip', '.tar', '.tgz', '.tar.gz', '.js'];
        const ext = extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) cb(null, true);
        else cb(new Error('Unsupported file type'), false);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new NotFoundException('No file uploaded');
    // store file metadata in plugin record
    return this.pluginsService.attachFile(id, file.filename, file.path);
  }

  // Download plugin file
  @Get(':id/file')
  async downloadFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.pluginsService.getFile(id);
    if (!file || !file.path) throw new NotFoundException('File not found');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.filename}"`,
    );
    const fs = await import('fs');
    return new StreamableFile(fs.createReadStream(file.path));
  }
}
