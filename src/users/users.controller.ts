import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUser: CreateUserDto) {
    this.usersService.create(createUser);
  }

  /* @Get()
  getHello(): string {
    return this.usersService.getHello();
  } */
}