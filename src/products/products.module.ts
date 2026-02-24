import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { OxModule } from '../ox/ox.module';

@Module({
  imports: [OxModule],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}

