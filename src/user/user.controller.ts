import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
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

  @Get(':id')
  async findOneUser(@Req() req, @Param('id') param) {
    try {
      return await this.userService.findOneUser(+param);
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
  @Post('image')
  async upload(@Req() req, @Res() res) {
    try {
      const jwt = req['frontend-mentor-link-sharing'];
      return await this.userService.upload(req, res, jwt.email);
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

  @Get('image/:id')
  async getImagePublic(@Param('id') param, @Res() res: Response) {
    try {
      const result = await this.userService.getImagePublic(param);
      const file = createReadStream(result);
      file.pipe(res);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
