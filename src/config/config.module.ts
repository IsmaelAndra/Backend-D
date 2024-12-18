import { Module } from '@nestjs/common';
import { CustomConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: 'CustomConfigService',
      useClass: CustomConfigService,
    },
  ],
  exports: ['CustomConfigService'],
})
export class ConfigModule {}
