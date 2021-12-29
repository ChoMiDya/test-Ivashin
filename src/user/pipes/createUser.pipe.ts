import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { emailValid } from "src/utils/validations/email";
import { nameValid } from "src/utils/validations/name";
import { CreateUserDto } from "../dto/createUser.dto";
import { ICreateUser } from "../interfaces/createUser.interface";

@Injectable()
export class CreateUserPipe implements PipeTransform {
  transform(input: CreateUserDto, metadata: ArgumentMetadata) {
    if(metadata.type != 'body' && !input) {
      throw new BadRequestException("Validation Failed");
    }

    const output: ICreateUser = {
      email: emailValid(input.email),
      firstName: nameValid(input.firstName, 'Invalid FirstName'),
      lastName: nameValid(input.lastName, 'Invalid LastName')
    }

    return output;
  }
}