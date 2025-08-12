// src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeORMConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', '127.0.0.1'),
  port: Number(configService.get<string>('DB_PORT', '3306')),
  username: configService.get<string>('DB_USER', 'root'),
  password: configService.get<string>('DB_PASS', ''),
  database: configService.get<string>('DB_NAME', 'nestjs_board'),
  autoLoadEntities: true,
  synchronize: true, // 개발만 true
  logging: ['query','error','warn'],
  charset: 'utf8mb4_general_ci',
  // type: 'postgres',
  // host: 'localhost',
  // port: 5432,
  // username: 'postgres',
  // password: 'postgres',
  // database: 'nestjs_board',
  // entities: [__dirname + '/../**/*.entity.{js,ts}'],                        
  // synchronize: true, // 개발용 
});
