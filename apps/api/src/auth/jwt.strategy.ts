import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  username: string;
  password?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cfg: ConfigService
  ) {
    // 쿠키 추출기를 안전하게 타이핑
    const cookieExtractor = (req: Request): string | null => {
      const raw: unknown = (req as any)?.cookies?.access_token;
      return typeof raw === 'string' && raw.length > 0 ? raw : null;
    };

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: cfg.get<string>('JWT_SECRET', 'defaultSecretKey'),
      ignoreExpiration: false,
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['id', 'username'],
    });
    if (!user) {
      throw new UnauthorizedException('로그인 실패: 사용자 없음');
    }
    return user;
  }
}
