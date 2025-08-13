import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    // 인증 관련 메서드 추가
    
    @Post('/signup')
    signUp(@Body() authCredentialDto: AuthCredentialDto): Promise<User>{
        return this.authService.signUp(authCredentialDto);
    }
}
