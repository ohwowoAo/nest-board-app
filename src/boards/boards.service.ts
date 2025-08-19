import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
   //private 사용하지않으면 다른 컴포넌트에서 borards 배열에 접근할 수 있다.

  constructor(
  @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
  ) {}
  
  async getAllBoards(): Promise<Board[]> {
    return this.boardRepo.find();
  } 

 async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepo.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
    return found;
  }

  async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    const entity = this.boardRepo.create({
      title: createBoardDto.title,
      description: createBoardDto.description,
      status: BoardStatus.PUBLIC,
      user, // 유저와 게시물 연결
    });
    return this.boardRepo.save(entity);
  }

  async deleteBoard(id: number): Promise<void> {
    const result = await this.boardRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    } 
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);    
    board.status = status;
    await this.boardRepo.save(board);
    return board;
  }
 
}
