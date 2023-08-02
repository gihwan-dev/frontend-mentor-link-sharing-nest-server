import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto, CreateAuthResponseDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { hashPassword } from './lib/hash';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
  ) {}
  async create(createAuthDto: CreateAuthDto): Promise<CreateAuthResponseDto> {
    try {
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

      const hashedAuth = { ...createAuthDto };

      hashedAuth.password = await hashPassword(createAuthDto.password);

      const createResult = await this.authRepository.create(hashedAuth);

      if (!createResult) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: '계정을 생성하는데 실패했습니다. 다시 시도해 주세요.',
        };
      }
      return {
        statusCode: HttpStatus.CREATED,
        message: '성공적으로 계정을 생성했습니다.',
      };
    } catch (e) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message:
          e.message ?? '계정을 생성하는데 실패했습니다. 다시 시도해 주세요.',
      };
    }
  }
}
