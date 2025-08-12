import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
   //private 사용하지않으면 다른 컴포넌트에서 borards 배열에 접근할 수 있다.

  constructor(
  @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
  ) {}

  async createBoard(dto: CreateBoardDto): Promise<Board> {
    const entity = this.boardRepo.create({
      title: dto.title,
      description: dto.description,
      status: BoardStatus.PUBLIC,
    });
    return this.boardRepo.save(entity);
  }

  async deleteBoard(id: number): Promise<void> {
    const result = await this.boardRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    } 
  }

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepo.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
    return found;
  }
}
