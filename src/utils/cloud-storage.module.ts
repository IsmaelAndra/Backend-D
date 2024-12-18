import { Module } from '@nestjs/common';
import { CloudStorageService } from './cloud-storage.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [CloudStorageService],
  exports: [CloudStorageService],
})
export class CloudStorageModule {}
