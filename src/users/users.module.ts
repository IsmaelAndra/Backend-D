import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { Rol } from '../roles/rol.entity';
import { CloudStorageModule } from 'src/utils/cloud-storage.module';

@Module({
  imports: [CloudStorageModule, TypeOrmModule.forFeature([User, Rol])],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
})
export class UsersModule {}
