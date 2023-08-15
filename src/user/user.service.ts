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
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  private readonly uploadPath = path.join(__dirname, '..', '..', 'images');
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findOne(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const [firstName, lastName] = user.username.split(' ');

    return {
      firstName,
      lastName,
      email: user.contactEmail,
    };
  }

  async upload(file: Express.Multer.File, email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(
        '유저 정보를 조회하는데 실패했습니다. 다시 시도해 주세요.',
      );
    }

    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }

    const filePath = path.join(this.uploadPath, `${user.id}` + '.jpg');

    await fs.promises.writeFile(filePath, file.buffer);

    return {
      message: '성공적으로 업데이트 했습니다.',
    };
  }

  async updateOne(updateUserDto: UpdateUserDto, jwt) {
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

    const updateUser = new UpdateUserDto();

    updateUser.username = updateUserDto.username;
    updateUser.contactEmail = updateUserDto.contactEmail ?? '';

    const updateResult = this.userRepository.update(user.id, updateUser);

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
        email: hashedAuth.email,
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

  async getImage(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }

    const imagePath = path.join(this.uploadPath, `${user.id}` + '.jpg');

    if (!fs.existsSync(imagePath)) {
      throw new NotFoundException();
    }

    return imagePath;
  }
}
