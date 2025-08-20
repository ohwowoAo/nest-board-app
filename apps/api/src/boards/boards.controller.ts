import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Board } from './board.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('boards')
export class BoardsController {
  private logger = new Logger('Boards');
  constructor(private readonly boardsService: BoardsService) {}

  
  @Get()
  getAllBoard(): Promise<Board[]> {
    return this.boardsService.getAllBoards();
  }

  @Post()
  @UsePipes(ValidationPipe) // DTO에 정의된 유효성 검사 적용
  createBoard(@Body() createBoardDto: CreateBoardDto,
  @GetUser() user: User,
  ): Promise<Board> {
    this.logger.verbose(`User ${user.username} creating a new board. Payload: ${JSON.stringify(createBoardDto)}`);
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Get('me')
  getUserBoard(
    @GetUser() user: User, // 현재 로그인한 유저 정보 가져오기
  ): Promise<Board[]> {
    this.logger.verbose(`User ${user.username} trying to get all boards`);
    return this.boardsService.getUserBoards(user);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsService.getBoardById(id);
  }

  @Delete('/:id')
  deleteBoard(@Param('id', ParseIntPipe) id, @GetUser() user: User ): Promise<void> {
    return this.boardsService.deleteBoard(id, user);
  }

  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ) {
    return this.boardsService.updateBoardStatus(id, status);
  }


}
