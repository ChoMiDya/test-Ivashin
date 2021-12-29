import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    unique: true
  })
  @Index()
  email: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({
    nullable: true
  })
  image?: string;
}