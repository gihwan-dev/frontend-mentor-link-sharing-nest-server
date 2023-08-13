import {
  Body,
  Controller,
  ExecutionContext,
  Get,
  HttpCode,
  HttpStatus,
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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findOne(context: ExecutionContext) {
    //do something
    // console.log(req.cookies['frontend-mentor-link-sharing']);
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
}
