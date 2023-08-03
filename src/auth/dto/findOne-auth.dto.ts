import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindOneAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export interface UpdateAuthResponseDto {
  message: string;
  statusCode: number;
  access_token: string | null;
}
