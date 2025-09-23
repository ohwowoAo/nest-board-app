import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  //private 사용하지않으면 다른 컴포넌트에서 borards 배열에 접근할 수 있다.

  constructor(
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>
  ) {}

  async getAllBoards(): Promise<Board[]> {
    return this.boardRepo.find();
  }

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepo.findOne({ where: { id }, relations: { user: true } });
    if (!found) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
    return found;
  }

  async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    const entity = this.boardRepo.create({
      title: createBoardDto.title,
      description: createBoardDto.description,
      status: createBoardDto.status ?? BoardStatus.PUBLIC,
      user, // 유저와 게시물 연결
    });
    return this.boardRepo.save(entity);
  }

  async deleteBoard(id: number, user: User): Promise<void> {
    const result = await this.boardRepo.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
  }

  async updateBoard(id: number, updateBoardDto: UpdateBoardDto, user: User): Promise<Board> {
    const board = await this.boardRepo.findOne({ where: { id, user } });
    if (!board) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    board.title = updateBoardDto.title ?? board.title;
    board.description = updateBoardDto.description ?? board.description;
    board.status = updateBoardDto.status ?? board.status;

    return this.boardRepo.save(board);
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    board.status = status;
    await this.boardRepo.save(board);
    return board;
  }

  async getUserBoards(user: User): Promise<Board[]> {
    return this.boardRepo.find({
      where: { user }, // user 기준으로 검색
    });
  }
}
