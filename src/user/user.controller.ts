import {
  Body,
  Controller,
  ExecutionContext,
  Get,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Patch()
  async updateOne(@Body() updateUserDto: UpdateUserDto) {}
}
