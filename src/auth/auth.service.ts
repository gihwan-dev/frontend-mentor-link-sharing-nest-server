import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto, CreateAuthResponseDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { comparePassword, hashPassword } from './lib/hash';
import { FindOneAuthDto, UpdateAuthResponseDto } from './dto/findOne-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private jwtService: JwtService,
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

      const newUser = await this.authRepository.create({
        ...hashedAuth,
        username: '',
      });

      const createResult = await this.authRepository.save(newUser);

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

  async signIn(findOneAuthDto: FindOneAuthDto): Promise<UpdateAuthResponseDto> {
    try {
      const savedUser = await this.authRepository.findOne({
        where: {
          email: findOneAuthDto.email,
        },
        select: ['password'],
      });

      if (!savedUser) {
        return {
          message: '해당 유저가 존재하지 않습니다. 다시 시도해 주세요.',
          statusCode: HttpStatus.NOT_FOUND,
          access_token: null,
        };
      }

      const isValidPassword = await comparePassword(
        findOneAuthDto.password,
        savedUser.password,
      );

      if (!isValidPassword) {
        return {
          message: '비밀번호가 일치하지 않습니다. 다시 시도해 주세요.',
          statusCode: HttpStatus.UNAUTHORIZED,
          access_token: null,
        };
      }

      // 만약 유효하다면 jwt 토큰 발급해서 반환해줌.
      const payload = { email: findOneAuthDto.email };

      const access_token = await this.jwtService.signAsync(payload);

      return {
        statusCode: HttpStatus.ACCEPTED,
        message: '로그인에 성공했습니다.',
        access_token: access_token,
      };

      // 아니라면 에러 메세지 전송
    } catch (e) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: '로그인에 실패했습니다. 다시시도해 주세요.',
        access_token: null,
      };
    }
  }

  async findOne({ email }: { email: string }) {
    console.log(email);
  }
}
