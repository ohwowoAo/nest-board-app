import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ){}

    async signUp(dto: AuthCredentialDto): Promise<User> {
      const { username, password } = dto;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.userRepo.create({ username, password: hashedPassword });

      try {
            return await this.userRepo.save(user);
          } catch (error) {
            // MySQL에서 unique key 위반 시 코드: 'ER_DUP_ENTRY'
            if (error.code === 'ER_DUP_ENTRY') {
              throw new ConflictException('이미 존재하는 username입니다.');
            } else {
              throw new InternalServerErrorException('회원가입 중 오류가 발생했습니다.');
            }
          }
    }
}
