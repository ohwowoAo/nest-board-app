//interface: 변수의 타입 체크, classes: 변수타입체크 & 인스턴스 생성
export interface Board {
  id: string; // 게시판 ID
  title: string; // 게시판 제목
  description: string;
  status: BoardStatus; // 게시판 상태
}

export enum BoardStatus {
  PUBLIC = 'PUBLIC', // 공개 게시판
  PRIVATE = 'PRIVATE', // 비공개 게시판
}