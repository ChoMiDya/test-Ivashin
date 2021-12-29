import { User } from "../user.entity";

export class UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.image = user.image;
  }
}