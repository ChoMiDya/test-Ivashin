import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Query, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { userImageValid } from 'src/utils/validations/userImage';
//import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserDto } from './dto/user.dto';
import { ICreateUser } from './interfaces/createUser.interface';
import { IUpdateUser } from './interfaces/updateUser.interface';
import { CreateUserPipe } from './pipes/createUser.pipe';
import { DeleteUserPipe } from './pipes/deleteUser.pipe';
import { FindUserPipe } from './pipes/findUser.pipe';
import { GeneratePdfPipe } from './pipes/generatePdf.pipe';
import { UpdateUserPipe } from './pipes/updateUser.pipe';
import { UploadImagePipe } from './pipes/uploadImage.pipe';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(CreateUserPipe)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUser: ICreateUser) {
    return this.userService.create(createUser);
  }

  @Get()
  @UsePipes(FindUserPipe)
  @HttpCode(HttpStatus.OK)
  async findOne(@Query('email') email: string): Promise<UserDto> {
    return this.userService.findOne(email);
  } 

  @Delete()
  @UsePipes(DeleteUserPipe)
  @HttpCode(HttpStatus.OK)
  async delete(@Body('email') email: string) {
    this.userService.delete(email);
  }

  @Patch()
  @UsePipes(UpdateUserPipe)
  @HttpCode(HttpStatus.OK)
  async update(@Body() updateUser: IUpdateUser) {
    return this.userService.update(updateUser);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 172000
    },
    fileFilter: userImageValid,
  }))
  @UsePipes(UploadImagePipe)
  @HttpCode(HttpStatus.OK)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('email') email: string
    ) {
    await this.userService.uploadImage(file, email);
  }

  @Post("pdf")
  @UsePipes(GeneratePdfPipe)
  @HttpCode(HttpStatus.OK)
  async generatePdf(@Body('email') email: string) {
    return await this.userService.generatePdf(email);
  }
}