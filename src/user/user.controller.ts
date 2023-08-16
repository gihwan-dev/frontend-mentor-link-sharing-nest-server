import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findOne(@Req() req) {
    try {
      const jwt = req['frontend-mentor-link-sharing'];
      return await this.userService.findOne(jwt.email);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const result = await this.userService.create(createUserDto);

    return response.status(result.statusCode).json({ message: result.message });
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch()
  async updateOne(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    const jwt = req['frontend-mentor-link-sharing'];
    return await this.userService.updateOne(updateUserDto, jwt);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter(
        req: any,
        file: {
          fieldname: string;
          originalname: string;
          encoding: string;
          mimetype: string;
          size: number;
          destination: string;
          filename: string;
          path: string;
          buffer: Buffer;
        },
        callback: (error: Error | null, acceptFile: boolean) => void,
      ) {
        if (
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/jpg' ||
          file.mimetype === 'image/png'
        ) {
          return callback(null, true);
        }
        return callback(new BadRequestException(), false);
      },
    }),
  )
  @Post('image')
  async upload(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() req,
  ) {
    try {
      const jwt = req['frontend-mentor-link-sharing'];
      return await this.userService.upload(file, jwt.email);
    } catch (error) {
      throw new InternalServerErrorException(
        '알 수 없는 오류로 이미지 저장에 실패했습니다.',
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('image')
  async getImage(@Req() req, @Res() res: Response) {
    try {
      const jwt = req['frontend-mentor-link-sharing'];
      const result = await this.userService.getImage(jwt.email);
      const file = createReadStream(result);
      file.pipe(res);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
