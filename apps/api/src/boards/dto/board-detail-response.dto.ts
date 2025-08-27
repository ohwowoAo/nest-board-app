import { BoardStatus } from '../board-status.enum';

export class BoardDetailResponseDto {
  id: number;
  title: string;
  description?: string | null;
  content?: string | null;
  status?: BoardStatus;
  username?: string | null;
}
