import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './interfaces/user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findOne(@Query('email') email: string): Promise<User> {
    return this.userService.findOne(email);
  } 

  @Delete()
  @HttpCode(HttpStatus.OK)
  async delete(@Body('email') email: string) {
    this.userService.delete(email);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(@Body() updateUser: UpdateUserDto): Promise<User> {
    return this.userService.update(updateUser);
  }
}