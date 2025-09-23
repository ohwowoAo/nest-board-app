export type BoardStatus = 'PUBLIC' | 'PRIVATE';

export interface Board {
  id: number;
  title: string;
  description?: string;
  status: BoardStatus;
}
