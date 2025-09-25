import { BoardStatus } from '../board-status.enum';

export class BoardDetailResponseDto {
  id: number;
  title: string;
  description?: string | null;
  status?: BoardStatus;
  username?: string;
  userId?: number;
}
