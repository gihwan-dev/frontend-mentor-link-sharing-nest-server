import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto, CreateAuthResponseDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
  ) {}
  async create(createAuthDto: CreateAuthDto): Promise<CreateAuthResponseDto> {
    const isExisting = await this.authRepository.findOne({
      where: {
        email: createAuthDto.email,
      },
    });

    if (isExisting) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: '이미 존재하는 이메일 입니다.',
      };
    }

    const createResult = await this.authRepository.create(createAuthDto);
  }
}
