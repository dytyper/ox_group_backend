import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OxModule } from './ox/ox.module';
import { CompaniesModule } from './companies/companies.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    OxModule,
    CompaniesModule,
    ProductsModule,
  ],
})
export class AppModule {}

