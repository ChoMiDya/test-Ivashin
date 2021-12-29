import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { emailValid } from "src/utils/validations/email";

@Injectable()
export class DeleteUserPipe implements PipeTransform {
  transform(input: string, metadata: ArgumentMetadata) {
    if(metadata.type != 'body' && !input) {
      throw new BadRequestException("Validation Failed");
    }

    const output = emailValid(input);
    return output;
  }
}