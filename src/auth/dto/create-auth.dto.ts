import { IsEmail, IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEmpty()
  username: string;
}

export interface CreateAuthResponseDto {
  message: string;
  statusCode: number;
}
