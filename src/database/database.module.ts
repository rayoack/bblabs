// @ts-nocheck
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION
        ? process.env.TYPEORM_CONNECTION
        : 'postgres',
      host: process.env.TYPEORM_HOST ? process.env.TYPEORM_HOST : 'localhost',
      port: process.env.TYPEORM_PORT ? process.env.TYPEORM_PORT : 5432,
      username: process.env.TYPEORM_USERNAME
        ? process.env.TYPEORM_USERNAME
        : 'klub',
      password: process.env.TYPEORM_PASSWORD
        ? process.env.TYPEORM_PASSWORD
        : 'klub123',
      database: process.env.TYPEORM_DATABASE
        ? process.env.TYPEORM_DATABASE
        : 'api_development',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
  ],
})
export class DatabaseModule {}
