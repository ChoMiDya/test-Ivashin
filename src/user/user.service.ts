import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateUser } from './interfaces/createUser.interface';
import { IUpdateUser } from './interfaces/updateUser.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}
  
  async create(createUser: ICreateUser) {
    const user = await this.userRepository.findOne({
      email: createUser.email
    });

    if(user) {
      throw new HttpException('User already exsists', 409);
    }

    return await this.userRepository.create(createUser).save();
  }

  async findOne(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      email
    });

    if(!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async delete(email: string) {
    await this.userRepository.delete({
      email
    });
  }

  async update(updateUser: IUpdateUser) {
    const { email, ...rest } = updateUser;
    const user = await this.userRepository.findOne({email});

    if(!user) {
      throw new NotFoundException("User not found");
    }

    for (const key in rest) {
      if (Object.prototype.hasOwnProperty.call(rest, key)) {
        const value = rest[key];
        user[key] = value;
      }
    }

    return await user.save();
  }
}