import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { ClientsService } from '../clients/clients.service';
import { PrismaService } from '../prisma/prisma.service';

async function createTestUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const authService = app.get(AuthService);
  const clientsService = app.get(ClientsService);
  const prisma = app.get(PrismaService);

  try {
    console.log('🌱 Creating test users and data for isolation testing...');

    // Try to create Admin user, or use existing
    let admin;
    try {
      admin = await authService.register({
        name: 'Admin User',
        email: 'admin@appbuilder.com',
        password: 'admin123',
      });
      console.log('✅ Admin user created:', admin.user.email);
    } catch {
      console.log('ℹ️ Admin user already exists, using existing account');
      admin = {
        user: await prisma.user.findUnique({
          where: { email: 'admin@appbuilder.com' },
        }),
      };
    }

    // Try to create Client user A, or use existing
    let clientA;
    try {
      clientA = await authService.register({
        name: 'Client User A',
        email: 'clienta@company.com',
        password: 'client123',
      });
      console.log('✅ Client user A created:', clientA.user.email);
    } catch {
      console.log('ℹ️ Client user A already exists, using existing account');
      const existingUser = await prisma.user.findUnique({
        where: { email: 'clienta@company.com' },
        include: { client: true },
      });
      clientA = { user: existingUser };
    }

    // Create or get client company A
    let clientCompanyA = clientA.user.client;
    if (!clientCompanyA) {
      clientCompanyA = await clientsService.create(
        {
          companyName: 'Test Company A',
        },
        clientA.user.id,
        'ADMIN',
      );
      console.log('✅ Client company A created:', clientCompanyA.companyName);
    } else {
      console.log(
        '✅ Using existing client company A:',
        clientCompanyA.companyName,
      );
    }

    // Try to create client user B, or use existing
    let clientB;
    try {
      clientB = await authService.register({
        name: 'Client User B',
        email: 'clientb@company.com',
        password: 'client456',
      });
      console.log('✅ Client user B created:', clientB.user.email);
    } catch {
      console.log('ℹ️ Client user B already exists, using existing account');
      const existingUser = await prisma.user.findUnique({
        where: { email: 'clientb@company.com' },
        include: { client: true },
      });
      clientB = { user: existingUser };
    }

    // Create or get client company B
    let clientCompanyB = clientB.user.client;
    if (!clientCompanyB) {
      clientCompanyB = await clientsService.create(
        {
          companyName: 'Test Company B',
        },
        clientB.user.id,
        'ADMIN',
      );
      console.log('✅ Client company B created:', clientCompanyB.companyName);
    } else {
      console.log(
        '✅ Using existing client company B:',
        clientCompanyB.companyName,
      );
    }

    // Create test projects for each client (skip if they exist)
    let projectA = await prisma.project.findFirst({
      where: { name: 'Project A - Client A', clientId: clientCompanyA.id },
    });

    if (!projectA) {
      projectA = await prisma.project.create({
        data: {
          name: 'Project A - Client A',
          description: 'Test project for Client A',
          clientId: clientCompanyA.id,
          platform: 'BOTH',
        },
      });
      console.log('✅ Project A created for Client A');
    } else {
      console.log('✅ Project A already exists for Client A');
    }

    let projectB = await prisma.project.findFirst({
      where: { name: 'Project B - Client B', clientId: clientCompanyB.id },
    });

    if (!projectB) {
      projectB = await prisma.project.create({
        data: {
          name: 'Project B - Client B',
          description: 'Test project for Client B',
          clientId: clientCompanyB.id,
          platform: 'BOTH',
        },
      });
      console.log('✅ Project B created for Client B');
    } else {
      console.log('✅ Project B already exists for Client B');
    }

    // Create test templates for each client (skip if they exist)
    const existingTemplateA = await prisma.clientTemplate.findUnique({
      where: {
        clientId_templateId: {
          clientId: clientCompanyA.id,
          templateId: 'bold-gradient',
        },
      },
    });

    if (!existingTemplateA) {
      await prisma.clientTemplate.create({
        data: {
          clientId: clientCompanyA.id,
          templateId: 'bold-gradient',
          customName: 'Client A Bold Gradient',
          isActive: true,
        },
      });
      console.log('✅ Template access created for Client A');
    } else {
      console.log('✅ Template access already exists for Client A');
    }

    const existingTemplateB = await prisma.clientTemplate.findUnique({
      where: {
        clientId_templateId: {
          clientId: clientCompanyB.id,
          templateId: 'clean-light',
        },
      },
    });

    if (!existingTemplateB) {
      await prisma.clientTemplate.create({
        data: {
          clientId: clientCompanyB.id,
          templateId: 'clean-light',
          customName: 'Client B Clean Light',
          isActive: true,
        },
      });
      console.log('✅ Template access created for Client B');
    } else {
      console.log('✅ Template access already exists for Client B');
    }

    // Create test screens for each project (skip if they exist)
    const existingScreenA = await prisma.projectScreen.findFirst({
      where: { name: 'Screen A1', projectId: projectA.id },
    });

    if (!existingScreenA) {
      await prisma.projectScreen.create({
        data: {
          name: 'Screen A1',
          order: 1,
          projectId: projectA.id,
          config: { title: 'Screen A1' },
        },
      });
      console.log('✅ Screen A1 created for Project A');
    } else {
      console.log('✅ Screen A1 already exists for Project A');
    }

    const existingScreenB = await prisma.projectScreen.findFirst({
      where: { name: 'Screen B1', projectId: projectB.id },
    });

    if (!existingScreenB) {
      await prisma.projectScreen.create({
        data: {
          name: 'Screen B1',
          order: 1,
          projectId: projectB.id,
          config: { title: 'Screen B1' },
        },
      });
      console.log('✅ Screen B1 created for Project B');
    } else {
      console.log('✅ Screen B1 already exists for Project B');
    }

    // Create test assets for each project (skip if they exist)
    const existingAssetA = await prisma.projectAsset.findFirst({
      where: { name: 'Asset A1', projectId: projectA.id },
    });

    if (!existingAssetA) {
      await prisma.projectAsset.create({
        data: {
          name: 'Asset A1',
          type: 'image',
          url: '/uploads/test-asset-a1.png',
          projectId: projectA.id,
        },
      });
      console.log('✅ Asset A1 created for Project A');
    } else {
      console.log('✅ Asset A1 already exists for Project A');
    }

    const existingAssetB = await prisma.projectAsset.findFirst({
      where: { name: 'Asset B1', projectId: projectB.id },
    });

    if (!existingAssetB) {
      await prisma.projectAsset.create({
        data: {
          name: 'Asset B1',
          type: 'image',
          url: '/uploads/test-asset-b1.png',
          projectId: projectB.id,
        },
      });
      console.log('✅ Asset B1 created for Project B');
    } else {
      console.log('✅ Asset B1 already exists for Project B');
    }

    // Create test builds for each project (skip if they exist)
    const existingBuildA = await prisma.build.findFirst({
      where: { name: 'Build A1', projectId: projectA.id },
    });

    if (!existingBuildA) {
      await prisma.build.create({
        data: {
          name: 'Build A1',
          version: '1.0.0',
          status: 'PENDING',
          platform: 'ANDROID',
          projectId: projectA.id,
        },
      });
      console.log('✅ Build A1 created for Project A');
    } else {
      console.log('✅ Build A1 already exists for Project A');
    }

    const existingBuildB = await prisma.build.findFirst({
      where: { name: 'Build B1', projectId: projectB.id },
    });

    if (!existingBuildB) {
      await prisma.build.create({
        data: {
          name: 'Build B1',
          version: '1.0.0',
          status: 'PENDING',
          platform: 'IOS',
          projectId: projectB.id,
        },
      });
      console.log('✅ Build B1 created for Project B');
    } else {
      console.log('✅ Build B1 already exists for Project B');
    }

    console.log('\n🎉 Test users and data created successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Admin Account:');
    console.log('   Email: admin@appbuilder.com');
    console.log('   Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Client Account A:');
    console.log('   Email: clienta@company.com');
    console.log('   Password: client123');
    console.log('   Company: Test Company A');
    console.log('   Projects: Project A - Client A');
    console.log('   Templates: Client A Bold Gradient');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Client Account B:');
    console.log('   Email: clientb@company.com');
    console.log('   Password: client456');
    console.log('   Company: Test Company B');
    console.log('   Projects: Project B - Client B');
    console.log('   Templates: Client B Clean Light');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔒 Isolation Test Plan:');
    console.log(
      '1. Login as Client A - should only see Project A and Client A templates',
    );
    console.log(
      '2. Login as Client B - should only see Project B and Client B templates',
    );
    console.log('3. Try to access Project B as Client A - should be denied');
    console.log('4. Try to access Project A as Client B - should be denied');
    console.log('5. Admin should see all projects and templates');
  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await app.close();
  }
}

void createTestUsers();
