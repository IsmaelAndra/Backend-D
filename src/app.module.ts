import { Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from './config/config.module';
import { CloudStorageModule } from './utils/cloud-storage.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: ['CustomConfigService'],
      useFactory: (configService: any) => ({
        type: 'postgres',
        host: configService.get('HOST'),
        port: parseInt(configService.get('PORT'), 10) || 5432,
        username: configService.get('USERNAME'),
        password: configService.get('PASSWORD'),
        database: configService.get('DATABASE'),
        entities: [__dirname + '/**/*.entity.{js,ts}'],
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    CategoriesModule,
    ProductsModule,
    ConfigModule,
    CloudStorageModule,
  ],
})
export class AppModule {
  static port: number;

  constructor(
    @Inject('CustomConfigService') private readonly configService: any,
  ) {
    AppModule.port = parseInt(this.configService.get('PORT'), 10);
  }
}
