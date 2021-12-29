import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

interface MulterFile {
  /** Field name specified in the form */
  fieldname: string;
  /** Name of the file on the user's computer */
  originalname: string;
  /** Encoding type of the file */
  encoding: string;
  /** Mime type of the file */
  mimetype: string;
  /** Size of the file in bytes */
  size: number;
  /** The folder to which the file has been saved (DiskStorage) */
  destination: string;
  /** The name of the file within the destination (DiskStorage) */
  filename: string;
  /** Location of the uploaded file (DiskStorage) */
  path: string;
  /** A Buffer of the entire file (MemoryStorage) */
  buffer: Buffer;
}

export function userImageValid(req, file: MulterFile, callback: (error: Error | null, acceptFile: boolean) => void): MulterOptions["fileFilter"] {
  const { mimetype } = file;
  
  if (!mimetype.startsWith("image")) {
    callback(new BadRequestException("File is not image"), false);
    return;
  }

  if (
    !mimetype.endsWith("png") &&
    !mimetype.endsWith("jpeg") &&
    !mimetype.endsWith("jpg")
  ) {
    callback(new BadRequestException("Incorrect format of image"), false);
    return;
  }

  callback(null, true);
}