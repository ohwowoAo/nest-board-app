import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<User> {
    const { username, password } = authCredentialDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepo.create({ username, password: hashedPassword });

    try {
      return await this.userRepo.save(user);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('이미 존재하는 username입니다.');
      } else {
        throw new InternalServerErrorException('회원가입 중 오류가 발생했습니다.');
      }
    }
  }

  async signIn(
    authCredentialDto: AuthCredentialDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = authCredentialDto;
    const user = await this.userRepo.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
    });
    if (!user) throw new UnauthorizedException('로그인 실패: 사용자 없음');

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      throw new UnauthorizedException('로그인 실패: 잘못된 username 또는 password입니다.');

    const payload = { username: user.username, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const newAccessToken = this.jwtService.sign(
        { username: payload.username, sub: payload.sub },
        { secret: process.env.JWT_SECRET, expiresIn: '1h' }
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('Refresh token invalid or expired');
    }
  }
}
