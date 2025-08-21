import { Body, Controller, Post, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // 인증 관련 메서드 추가

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto): Promise<User> {
    return this.authService.signUp(authCredentialDto);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) dto: AuthCredentialDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken } = await this.authService.signIn(dto);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 1000 * 60 * 60,
    });
    return { ok: true };
  }

  // @Post('/test')
  // @UseGuards(AuthGuard())
  // test(@GetUser() user: User) {
  //   console.log('user', user);
  // }
}
