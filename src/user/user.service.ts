import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateUser } from './interfaces/createUser.interface';
import { IUpdateUser } from './interfaces/updateUser.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as fs from "fs";
import * as path from "path";
import cryptoRandomString = require('crypto-random-string');

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

  async uploadImage(file: Express.Multer.File, email: string) {
    const user = await this.userRepository.findOne({
      email
    });

    if(!user) {
      throw new NotFoundException("User not found");
    }
    const originalFileName = file.originalname;
    const fileExtension = this.fileExtansionMap(originalFileName);
    const fileName = cryptoRandomString({length: 30, type: 'hex'});
    const filepath = path.resolve(`${process.cwd()}/static/${fileName}.${fileExtension}`);
    
    fs.writeFile(filepath, file.buffer, async (error) => {
      if (error) {
        return;
      }
      user.image = filepath;
      await user.save();
    });   
  }

  private fileExtansionMap(fileName: string): string {
    const alowedFileExtansions = [
      "png",
      "jpeg",
      "jpg"
    ]

    for (const fileExtansion of alowedFileExtansions) {
      if (fileName.endsWith(fileExtansion)) {
        return fileExtansion;
      }
    }

    return "jpeg";
  }
}