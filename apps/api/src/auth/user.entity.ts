import { Board } from '../boards/board.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  username: string;

  @Column({ length: 200, select: false })
  password: string;

  @OneToMany(() => Board, (board) => board.user, { eager: true })
  boards: Board[];
}
