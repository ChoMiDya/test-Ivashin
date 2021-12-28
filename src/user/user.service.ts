import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
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
  
  async create(createUser: CreateUserDto) {
    const user: ICreateUser = {
      email: createUser.email,
      firstName: createUser.firstName,
      lastName: createUser.lastName,
    }

    return await this.userRepository.create(user).save();
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

  async update(updateUser: UpdateUserDto) {
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