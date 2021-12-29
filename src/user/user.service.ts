import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateUser } from './interfaces/createUser.interface';
import { IUpdateUser } from './interfaces/updateUser.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as fs from "fs";
import * as path from "path";
import cryptoRandomString = require('crypto-random-string');
import PDFDocument = require("pdfkit");

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
    const filepath = path.resolve(`${process.cwd()}/static/images/${fileName}.${fileExtension}`);
    
    fs.writeFile(filepath, file.buffer, async (error) => {
      if (error) {
        return;
      }
      user.image = filepath;
      await user.save();
    });   
  }

  async generatePdf(email: string) {
    const user = await this.userRepository.findOne({
      email
    });

    if(!user) {
      throw new NotFoundException("User not found");
    }

    const doc = new PDFDocument();

    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    const result = new Promise<void>((resolve, reject) => {
      doc.on('end', async () => {
        const pdfData = Buffer.concat(buffers);
        user.pdf = pdfData;
        await user.save();
        resolve();
      });
    });
    
    doc
    .font(`${process.cwd()}/static/fonts/arialmt.ttf`)
    .fontSize(25)
    .text(`Имя: ${user.firstName}`, 50, 50);
    
    doc
    .text(`Фамилия: ${user.lastName}`, 50, 100);

    doc
    .text("Фото:", 50, 150);

    doc.image(user.image, 0, 200, {
      fit: [250, 300],
      align: 'center',
      valign: 'center',
    });

    doc.end();
    await result;
    return true;
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