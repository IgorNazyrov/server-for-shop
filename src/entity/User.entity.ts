import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'password_hash',
    nullable: false
  })
  passwordHash: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false
  })
  email: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at'
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    name: 'last_login',
    nullable: true
  })
  lastLogin: Date | null;

  @Column({
    type: 'boolean',
    default: true,
    name: 'is_active'
  })
  isActive: boolean;
}