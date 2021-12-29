import { BadRequestException } from '@nestjs/common';
import { validate } from 'isemail';

export function emailValid(email: string) {
  try {
    if(typeof email != 'string' || !email) {
      throw 0;
    }

    const formatedEmail = email.toLowerCase().normalize().trim();
    
    if(!validate(formatedEmail)) {
      throw 0;
    }

    return formatedEmail;
  } catch (error) {
    throw new BadRequestException("Invalid email"); 
  }
}