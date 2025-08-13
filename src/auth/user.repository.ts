import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // UserRepository에 대한 메서드 정의
  // 예: findById, createUser 등
}   