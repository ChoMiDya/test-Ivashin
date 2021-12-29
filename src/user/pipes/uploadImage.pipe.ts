import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { emailValid } from "src/utils/validations/email";

@Injectable()
export class UploadImagePipe implements PipeTransform {
  transform(input: string, metadata: ArgumentMetadata) {
    if (metadata.type == "custom" && metadata.data == undefined) {
      return input;
    }

    if(metadata.type != 'body' && !input) {
      throw new BadRequestException("Validation Failed");
    }

    const output = emailValid(input);
    return output;
  }
}