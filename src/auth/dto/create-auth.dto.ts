import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export interface CreateAuthResponseDto {
  message: string;
  statusCode: number;
}
