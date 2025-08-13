import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ){}

    async signUp(dto: AuthCredentialDto): Promise<User> {
    const { username, password } = dto;
    const user = this.userRepo.create({ username, password });
    return this.userRepo.save(user);
  }
}
