import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';

export class FindOneAuthDto extends PartialType(CreateAuthDto) {}
export interface UpdateAuthResponseDto {
  message: string;
  statusCode: number;
  access_token: string | null;
}
