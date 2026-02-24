import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OxService } from './ox.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  providers: [OxService],
  exports: [OxService],
})
export class OxModule {}

