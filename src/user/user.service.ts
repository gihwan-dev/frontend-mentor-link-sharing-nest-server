import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hashPassword } from '../auth/lib/hash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { saveImageHandler } from './lib/image-lib';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async updateOne(updateUserDto: UpdateUserDto, jwt) {
    console.log(updateUserDto.imageURL);
    const user = await this.userRepository.findOne({
      where: {
        email: jwt.email,
      },
    });

    if (!user) {
      throw new NotFoundException(
        '유저 정보가 존재하지 않습니다. 다시 로그인을 시도해 주세요.',
      );
    }

    await saveImageHandler(updateUserDto.username, updateUserDto.imageURL);

    const updateUser = new UpdateUserDto();

    updateUser.username = updateUserDto.username;
    updateUser.contactEmail = updateUserDto.contactEmail;
    updateUser.imageURL = `${updateUserDto.username.trim()}.*`;

    const updateResult = this.userRepository.update(user, updateUser);

    if (!updateResult) {
      throw new ForbiddenException(
        '업데이트에 실패했습니다. 다시시도해 주세요.',
      );
    }
    return {
      message: '성공적으로 업데이트 하였습니다.',
    };
  }

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
