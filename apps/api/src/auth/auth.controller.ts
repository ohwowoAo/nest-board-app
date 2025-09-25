import { Body, Controller, Get, Post, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto): Promise<User> {
    return this.authService.signUp(authCredentialDto);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) dto: AuthCredentialDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(dto);

    // access_token 쿠키 저장
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 1000 * 60 * 60, // 1시간
    });

    // refresh_token 쿠키 저장
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    return { ok: true };
  }

  @Post('/refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    // AuthService로 위임
    return this.authService.refresh(refreshToken);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard) // 로그인된 사용자만 접근 가능
  getMe(@GetUser() user: User) {
    return user;
  }
}
