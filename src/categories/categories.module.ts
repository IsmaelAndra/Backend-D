import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { CloudStorageModule } from 'src/utils/cloud-storage.module';

@Module({
  imports: [CloudStorageModule, TypeOrmModule.forFeature([Category])],
  providers: [CategoriesService, JwtStrategy],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
