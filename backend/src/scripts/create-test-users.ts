import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { ClientsService } from '../clients/clients.service';

async function createTestUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const authService = app.get(AuthService);
  const clientsService = app.get(ClientsService);

  try {
    console.log('🌱 Creating test users...');

    // Create Admin user
    const admin = await authService.register({
      name: 'Admin User',
      email: 'admin@appbuilder.com',
      password: 'admin123',
    });
    console.log('✅ Admin user created:', admin.user.email);

    // Create Client user
    const client = await authService.register({
      name: 'Client User',
      email: 'client@company.com',
      password: 'client123',
    });
    
    // Create client company
    const clientCompany = await clientsService.create(
      {
        companyName: 'Test Company',
      },
      client.user.id,
      'ADMIN'
    );
    console.log('✅ Client user created:', client.user.email);
    console.log('✅ Client company created:', clientCompany.companyName);

    // Create second client user
    const client2 = await authService.register({
      name: 'Second Client',
      email: 'client2@company.com',
      password: 'client456',
    });
    
    const clientCompany2 = await clientsService.create(
      {
        companyName: 'Another Company',
      },
      client2.user.id,
      'ADMIN'
    );
    console.log('✅ Second client user created:', client2.user.email);
    console.log('✅ Second client company created:', clientCompany2.companyName);

    console.log('\n🎉 Test users created successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Admin Account:');
    console.log('   Email: admin@appbuilder.com');
    console.log('   Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Client Account 1:');
    console.log('   Email: client@company.com');
    console.log('   Password: client123');
    console.log('   Company: Test Company');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Client Account 2:');
    console.log('   Email: client2@company.com');
    console.log('   Password: client456');
    console.log('   Company: Another Company');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await app.close();
  }
}

createTestUsers();