import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { emailValid } from "src/utils/validations/email";
import { nameValid } from "src/utils/validations/name";
import { UpdateUserDto } from "../dto/updateUser.dto";
import { IUpdateUser } from "../interfaces/updateUser.interface";

@Injectable()
export class UpdateUserPipe implements PipeTransform {
  transform(input: UpdateUserDto, metadata: ArgumentMetadata) {
    if(metadata.type != 'body' && !input) {
      throw new BadRequestException("Validation Failed");
    }

    const output: IUpdateUser = {
      email: emailValid(input.email)
    }

    if(input.firstName) {
      output.firstName = nameValid(input.firstName, 'Invalid FirstName');
    }

    if(input.lastName) {
      output.lastName = nameValid(input.lastName, 'Invalid LastName');
    }

    return output;
  }
}