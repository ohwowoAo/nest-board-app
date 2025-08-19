// src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeORMConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: configService.get<'mysql'>('DB_TYPE'),
  host: configService.get<string>('DB_HOST'),
  port: Number(configService.get<string>('DB_PORT')),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASS'),
  database: configService.get<string>('DB_NAME'),
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: configService.get<string>('NODE_ENV') !== 'production', // 운영에서는 false
  logging: ['query', 'error', 'warn'],
  charset: 'utf8mb4_general_ci',
});
