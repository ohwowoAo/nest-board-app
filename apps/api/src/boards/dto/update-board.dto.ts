import { IsOptional, IsString, IsEnum } from 'class-validator';
import { BoardStatus } from '../board-status.enum';

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(BoardStatus)
  status?: BoardStatus;
}
