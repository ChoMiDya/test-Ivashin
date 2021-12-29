import { BadRequestException } from '@nestjs/common';

export function nameValid(name: string, messageError: string = 'Invalid Name') {
  try {
    if(typeof name != 'string' || !name || name.length > 50) {
      throw 0;
    }

    const formatedName = name.toLowerCase()
    .replace(/\s+/g, ' ')
    .normalize()
    .trim()
    .split(" ")
    .map((partName) => {
      const arrayLetters = partName.split("");
      arrayLetters[0] = arrayLetters[0].toUpperCase();
      return arrayLetters.join("");
    })
    .join(" ");

    return formatedName;
  } catch (error) {
    throw new BadRequestException(messageError); 
  }
}