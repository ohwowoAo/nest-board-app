import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './boards/configs/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: typeORMConfig,
      inject: [], // Add ConfigService if needed, e.g., [ConfigService]
    }),
    BoardsModule
  ],
})
export class AppModule {}
