import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppshotProjectDto } from './dto/create-appshot-project.dto';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class ScreenshotsService {
  private readonly logger = new Logger(ScreenshotsService.name);
  private readonly appshotPath = path.join(process.cwd(), '..', 'appshot');
  private readonly appshotCorePath = path.join(this.appshotPath, 'src', 'core');
  private readonly appshotProjectsDir = path.join(this.appshotPath, 'projects');

  constructor(private prisma: PrismaService) {}

  /**
   * Get all templates (sets) from the appshot core module
   * If clientId is provided, filter to only show templates assigned to that client
   */
  async getTemplates(clientId?: string) {
    try {
      const setsPath = path.join(this.appshotCorePath, 'sets.js');

      if (!fs.existsSync(setsPath)) {
        throw new NotFoundException('Sets module not found');
      }

      // Read and parse the sets file directly
      const setsContent = fs.readFileSync(setsPath, 'utf-8');

      // Better parsing approach - extract all template definitions
      const sets: any = {};

      // Split by template entries (each starts with 'id': {)
      const entries = setsContent.split(/'([^']+)':\s*\{/);

      for (let i = 1; i < entries.length; i += 2) {
        const id = entries[i - 1];
        const content = entries[i];

        // Extract name and hint from the content
        const nameMatch = content.match(/name:\s*'([^']+)'/);
        const hintMatch = content.match(/hint:\s*'([^']+)'/);

        if (id) {
          sets[id] = {
            name: nameMatch ? nameMatch[1] : id,
            description: hintMatch ? hintMatch[1] : '',
          };
        }
      }

      // Convert to array format expected by frontend
      let allTemplates = Object.entries(sets).map(
        ([id, set]: [string, any]) => ({
          id,
          name: set.name || id,
          description: set.description || '',
        }),
      );

      // If clientId is provided, filter to only show assigned templates
      if (clientId) {
        const clientTemplates = await this.prisma.clientTemplate.findMany({
          where: {
            clientId,
            isActive: true,
          },
          select: {
            templateId: true,
            customName: true,
          },
        });

        const assignedTemplateIds = new Set(
          clientTemplates.map((ct) => ct.templateId),
        );

        // Filter templates and apply custom names if available
        allTemplates = allTemplates
          .filter((template) => assignedTemplateIds.has(template.id))
          .map((template) => {
            const clientTemplate = clientTemplates.find(
              (ct) => ct.templateId === template.id,
            );
            return {
              ...template,
              name: clientTemplate?.customName || template.name,
            };
          });

        // If client has no assigned templates, return empty array
        if (allTemplates.length === 0) {
          this.logger.warn(`No templates assigned to client ${clientId}`);
          return [];
        }
      }

      return allTemplates;
    } catch (error) {
      this.logger.error('Failed to get templates:', error);
      // Fallback to hardcoded sets if import fails
      let fallbackTemplates = [
        {
          id: 'bold-gradient',
          name: 'Bold Gradient',
          description:
            'Vivid purple-to-pink gradient, heavy white headline. The safest all-rounder.',
        },
        {
          id: 'clean-light',
          name: 'Clean Light',
          description:
            'White ground, dark copy. For productivity and finance apps.',
        },
        {
          id: 'panorama-flow',
          name: 'Panorama Flow',
          description:
            'The whole set flows as one wide image — neighbouring screens peek in.',
        },
        {
          id: 'panorama-tilt',
          name: 'Panorama Tilt',
          description:
            'An unbroken ribbon of tilted devices. Very strong seen as a set.',
        },
        {
          id: 'dark-pro',
          name: 'Dark Pro',
          description:
            'Black ground, fine dot pattern, bezel-free shots. For tools and developer apps.',
        },
        {
          id: 'editorial-serif',
          name: 'Editorial Serif',
          description:
            'Cream ground, serif headline. For reading, health and content apps.',
        },
        {
          id: 'soft-pastel',
          name: 'Soft Pastel',
          description:
            'Soft pastel mesh, rounded type. For kids, wellbeing and habit apps.',
        },
        {
          id: 'neon-night',
          name: 'Neon Night',
          description:
            'Dark neon mesh, uppercase headline. Games and entertainment.',
        },
        {
          id: 'full-immersive',
          name: 'Full Immersive',
          description:
            'The screenshot fills the frame, copy floats on top. Video and photo apps.',
        },
        {
          id: 'story-duo',
          name: 'Story Duo',
          description:
            'Multi-device heavy — for showing features side by side.',
        },
        {
          id: 'poster-editorial',
          name: 'Poster — Editorial',
          description:
            'Serif cover with no device, then clean device frames. Cream, ink and calm.',
        },
        {
          id: 'poster-photo',
          name: 'Poster — Photo',
          description:
            'Every frame a full-bleed poster, no devices at all. For photo and AI apps.',
        },
        {
          id: 'story-blocks',
          name: 'Storyboard — Blocks',
          description:
            'Lime blocks cut across frame edges on deep teal. The screens read as one strip.',
        },
        {
          id: 'story-citrus',
          name: 'Storyboard — Citrus',
          description:
            'Full-height yellow and teal panels, offset by half a frame.',
        },
        {
          id: 'story-organic',
          name: 'Storyboard — Organic',
          description:
            'Orange and dark blobs drift over blue; every third frame is cut by a spanning device.',
        },
        {
          id: 'story-wave',
          name: 'Storyboard — Wave',
          description:
            'A single mustard wave crosses the whole set, spanning devices riding on it.',
        },
        {
          id: 'story-berry',
          name: 'Storyboard — Berry',
          description:
            'Crimson and purple panels; an even device row with all copy on top.',
        },
        {
          id: 'story-circles',
          name: 'Storyboard — Circles',
          description:
            'Large circles sitting behind the copy; a calm, even device row.',
        },
      ];

      // Apply client filtering for fallback templates as well
      if (clientId) {
        const clientTemplates = await this.prisma.clientTemplate.findMany({
          where: {
            clientId,
            isActive: true,
          },
          select: {
            templateId: true,
            customName: true,
          },
        });

        const assignedTemplateIds = new Set(
          clientTemplates.map((ct) => ct.templateId),
        );

        fallbackTemplates = fallbackTemplates
          .filter((template) => assignedTemplateIds.has(template.id))
          .map((template) => {
            const clientTemplate = clientTemplates.find(
              (ct) => ct.templateId === template.id,
            );
            return {
              ...template,
              name: clientTemplate?.customName || template.name,
            };
          });
      }

      return fallbackTemplates;
    }
  }

  /**
   * Create a new Screenshots project
   */
  async createAppshotProject(
    clientId: string,
    projectId: string,
    createAppshotProjectDto: CreateAppshotProjectDto,
  ) {
    try {
      // Verify client exists
      const client = await this.prisma.client.findUnique({
        where: { id: clientId },
      });

      if (!client) {
        throw new NotFoundException('Client not found');
      }

      // Generate a unique project name for Screenshots
      const appshotProjectName = `${clientId}_${projectId}`;

      // Ensure appshot directory exists
      if (!fs.existsSync(this.appshotPath)) {
        this.logger.error(`Appshot directory not found: ${this.appshotPath}`);
        throw new Error(
          'Appshot directory not found. Please ensure Screenshots is properly installed.',
        );
      }

      // Create the Screenshots project using the CLI
      let command = `cd "${this.appshotPath}" && node src/cli/index.js new "${appshotProjectName}"`;

      if (createAppshotProjectDto.app) {
        command += ` --app "${createAppshotProjectDto.app}"`;
      }

      if (createAppshotProjectDto.bg) {
        command += ` --bg "${createAppshotProjectDto.bg}"`;
      }

      this.logger.log(`Creating Screenshots project: ${command}`);

      const { stdout, stderr } = await execAsync(command);
      this.logger.log(`Screenshots project creation stdout: ${stdout}`);
      if (stderr) {
        this.logger.warn(`Screenshots project creation stderr: ${stderr}`);
      }

      // If template is specified, apply it using the CLI
      if (createAppshotProjectDto.templateId) {
        const packCommand = `cd "${this.appshotPath}" && node src/cli/index.js pack "${appshotProjectName}" "${createAppshotProjectDto.templateId}"`;
        this.logger.log(`Applying template: ${packCommand}`);

        const { stdout: packStdout, stderr: packStderr } =
          await execAsync(packCommand);
        this.logger.log(`Template application stdout: ${packStdout}`);
        if (packStderr) {
          this.logger.warn(`Template application stderr: ${packStderr}`);
        }
      }

      return {
        appshotProjectName,
        templateId: createAppshotProjectDto.templateId,
      };
    } catch (error) {
      this.logger.error('Failed to create Screenshots project:', error);
      throw new Error(
        `Failed to create Screenshots project: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get Screenshots project data
   */
  async getAppshotProject(clientId: string, appshotProjectName: string) {
    try {
      // Verify ownership by checking if the client has a project with this appshotProjectName
      const project = await this.prisma.project.findFirst({
        where: {
          clientId,
          appshotProjectName,
        },
      });

      if (!project) {
        throw new ForbiddenException('Access denied');
      }

      const projectPath = path.join(
        this.appshotProjectsDir,
        appshotProjectName,
        'project.json',
      );

      if (!fs.existsSync(projectPath)) {
        throw new NotFoundException('Screenshots project not found');
      }

      const projectData = JSON.parse(fs.readFileSync(projectPath, 'utf-8'));
      return projectData;
    } catch (error) {
      this.logger.error('Failed to get Screenshots project:', error);
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Failed to load Screenshots project');
    }
  }

  /**
   * Delete a Screenshots project
   */
  async deleteAppshotProject(clientId: string, appshotProjectName: string) {
    try {
      // Verify ownership by checking if the client has a project with this appshotProjectName
      const project = await this.prisma.project.findFirst({
        where: {
          clientId,
          appshotProjectName,
        },
      });

      if (!project) {
        throw new ForbiddenException('Access denied');
      }

      const projectPath = path.join(
        this.appshotProjectsDir,
        appshotProjectName,
      );

      if (!fs.existsSync(projectPath)) {
        this.logger.warn(
          `Screenshots project not found: ${appshotProjectName}`,
        );
        return; // Already deleted, don't throw error
      }

      // Delete the project directory
      fs.rmSync(projectPath, { recursive: true, force: true });

      this.logger.log(`Deleted Screenshots project: ${appshotProjectName}`);
    } catch (error) {
      this.logger.error('Failed to delete Screenshots project:', error);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new Error('Failed to delete Screenshots project');
    }
  }

  /**
   * Upload an asset to a Screenshots project
   */
  async uploadAsset(
    clientId: string,
    appshotProjectName: string,
    filename: string,
    buffer: Buffer,
  ) {
    try {
      // Verify ownership by checking if the client has a project with this appshotProjectName
      const project = await this.prisma.project.findFirst({
        where: {
          clientId,
          appshotProjectName,
        },
      });

      if (!project) {
        throw new ForbiddenException('Access denied');
      }

      const assetsDir = path.join(
        this.appshotProjectsDir,
        appshotProjectName,
        'assets',
      );

      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }

      const filePath = path.join(assetsDir, filename);
      fs.writeFileSync(filePath, buffer);

      return `assets/${filename}`;
    } catch (error) {
      this.logger.error('Failed to upload asset:', error);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new Error('Failed to upload asset');
    }
  }

  /**
   * Get devices from the appshot core module
   */
  getDevices() {
    try {
      const devicesPath = path.join(this.appshotCorePath, 'devices.js');

      if (!fs.existsSync(devicesPath)) {
        throw new NotFoundException('Devices module not found');
      }

      // Read and parse the devices file directly
      const devicesContent = fs.readFileSync(devicesPath, 'utf-8');

      // Parse the DEVICES object
      const devicesMatch = devicesContent.match(
        /export const DEVICES = \{([\s\S]*?)\};/,
      );
      if (!devicesMatch) {
        throw new NotFoundException('Devices not found in file');
      }

      const devices: any[] = [];
      const deviceEntries = devicesMatch[1].match(/'([^']+)': \{([^}]+)\}/g);

      if (deviceEntries) {
        for (const entry of deviceEntries) {
          const idMatch = entry.match(/'([^']+)'/);
          const labelMatch = entry.match(/label: '([^']+)'/);
          const storeMatch = entry.match(/store: '([^']+)'/);

          if (idMatch) {
            devices.push({
              id: idMatch[1],
              label: labelMatch ? labelMatch[1] : idMatch[1],
              store: storeMatch ? storeMatch[1] : 'unknown',
            });
          }
        }
      }

      return devices;
    } catch (error) {
      this.logger.error('Failed to get devices:', error);
      throw new NotFoundException(
        'Failed to load devices from Screenshots module',
      );
    }
  }

  /**
   * Download all exported screenshots for a project as a ZIP file
   */
  async downloadScreenshots(clientId: string, appshotProjectName: string): Promise<StreamableFile> {
    try {
      // Verify ownership by checking if the client has a project with this appshotProjectName
      const project = await this.prisma.project.findFirst({
        where: {
          clientId,
          appshotProjectName,
        },
      });

      if (!project) {
        throw new ForbiddenException('Access denied');
      }

      const outDir = path.join(this.appshotPath, 'out', appshotProjectName);

      if (!fs.existsSync(outDir)) {
        throw new NotFoundException('No exported screenshots found for this project');
      }

      // Create a ZIP file from the output directory
      const AdmZip = (await import('adm-zip')).default;
      const zip = new AdmZip();

      // Add all files from the output directory to the ZIP
      this.addDirectoryToZip(zip, outDir, '');

      const zipBuffer = zip.toBuffer();

      return new StreamableFile(zipBuffer);
    } catch (error) {
      this.logger.error('Failed to download screenshots:', error);
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Failed to download screenshots');
    }
  }

  /**
   * Recursively add directory contents to ZIP
   */
  private addDirectoryToZip(zip: any, dirPath: string, zipPath: string) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.join(zipPath, entry.name);

      if (entry.isDirectory()) {
        this.addDirectoryToZip(zip, fullPath, relativePath);
      } else if (entry.isFile()) {
        zip.addLocalFile(fullPath, zipPath);
      }
    }
  }
}
