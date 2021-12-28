import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  private users: User[] = [];
  
  create(createUser: CreateUserDto) {
    const user: User = {
      email: createUser.email,
      firstName: createUser.firstName,
      lastName: createUser.lastName,
      image: '',
      pdf: '',
    }

    this.users.push(user);
    return user;
  }

  findOne(email: string): User {
    const user: User = this.users.find(item => item.email == email);

    if(!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  delete(email: string) {
    let i: number;
    const user = this.users.find((item, index) => {
      if(item.email == email) {
        i = index;
        return true;
      }
    });

    if(!user) {
      throw new NotFoundException("User not found");
    }

    this.users.splice(i, 1);
  }

  update(updateUser: UpdateUserDto) {
    let user: User;

    for(let i = 0; i < this.users.length; i++) {
      if(this.users[i].email != updateUser.email) {
        continue;
      }

      for (const key in updateUser) {
        if (Object.prototype.hasOwnProperty.call(updateUser, key)) {
          const value = updateUser[key];
          this.users[i][key] = value;
        }
      }

      user = this.users[i];
      break;
    }

    return user;
  }
}


