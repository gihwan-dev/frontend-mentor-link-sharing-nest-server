import { HttpStatus, Injectable } from '@nestjs/common';
import { hashPassword } from '../auth/lib/hash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    try {
      const isExisting = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });

      if (isExisting) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: '이미 존재하는 이메일 입니다.',
        };
      }

      const hashedAuth = { ...createUserDto };

      hashedAuth.password = await hashPassword(createUserDto.password);

      const newUser = this.userRepository.create({
        ...hashedAuth,
        username: hashedAuth.email,
      });

      const createResult = await this.userRepository.save(newUser);

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
