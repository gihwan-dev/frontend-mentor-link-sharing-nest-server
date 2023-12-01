import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Req,
  Res,
} from '@nestjs/common';
import { hashPassword } from '../auth/lib/hash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import * as fs from 'fs';
import * as path from 'path';
import multer from 'multer';

@Injectable()
export class UserService {
  uploadToS3 = multer({
    storage: multerS3({
      s3: new S3Client({
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_KEY,
        },
        region: 'ap-northeast-2',
      }),
      contentType: multerS3.AUTO_CONTENT_TYPE,
      bucket: process.env.S3_BUCKET_NAME,
      acl: 'public-read',
      key: function (request, file, cb) {
        cb(
          null,
          `image/user/${Date.now().toString()}-${Math.random()
            .toFixed()
            .toString()}`,
        );
      },
    }),
  }).array('image', 1);
  private readonly uploadPath = path.join(__dirname, '..', '..', 'images');

  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
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
      image: user.image,
    };
  }

  async findOneUser(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      select: {
        email: true,
        contactEmail: true,
        image: true,
        username: true,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    console.log(user);
    return user;
  }

  async upload(@Req() req, @Res() res, email: string) {
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

    this.uploadToS3(req, res, async (error) => {
      if (error) {
        console.log(error);
        throw new NotFoundException('이미지 갱신에 실패했습니다.');
      }

      const file = req.files[0]; // 업로드된 파일 정보
      const imageUrl = file.location; // S3에 저장된 이미지 URL

      await this.userRepository.update(user.id, {
        image: imageUrl,
      });
      res.status(201).json('이미지 갱신에 성공했습니다.');
    });
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

  async getImagePublic(id: string) {
    const imagePath = path.join(this.uploadPath, `${id}` + '.jpg');

    if (!fs.existsSync(imagePath)) {
      throw new NotFoundException();
    }

    return imagePath;
  }
}
