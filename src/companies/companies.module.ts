import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { OxModule } from '../ox/ox.module';

@Module({
  imports: [OxModule],
  providers: [CompaniesService],
  controllers: [CompaniesController],
})
export class CompaniesModule {}

