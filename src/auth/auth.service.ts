import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { comparePassword } from './lib/hash';
import { FindOneAuthDto, UpdateAuthResponseDto } from './dto/findOne-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async getProfile({ email }: { email: string }) {
    try {
      if (!email) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: '잘못된 요청입니다. 로그인 후 다시 시도해 주세요.',
        };
      }
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
        select: ['id'],
      });

      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message:
            '해당 유저를 찾지 못했습니다. 로그아웃 후 다시 시도해 주세요.',
        };
      }
      return {
        statusCode: HttpStatus.ACCEPTED,
        id: user.id,
      };
    } catch {
      return {
        statusCode: HttpStatus.FORBIDDEN,
      };
    }
  }

  async signIn(findOneAuthDto: FindOneAuthDto): Promise<UpdateAuthResponseDto> {
    try {
      const savedUser = await this.userRepository.findOne({
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
}
