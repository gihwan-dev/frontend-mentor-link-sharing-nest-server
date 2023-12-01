import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PlatformService } from './platform.service';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @Get()
  async findMany(@Req() req) {
    try {
      const jwt = req['frontend-mentor-link-sharing'];
      return await this.platformService.findMany(jwt.email);
    } catch (error) {
      return new InternalServerErrorException();
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch()
  async update(@Req() req, @Body() updatePlatformDto: UpdatePlatformDto) {
    const jwt = req['frontend-mentor-link-sharing'];
    try {
      return await this.platformService.update(updatePlatformDto, jwt.email);
    } catch (error) {
      return new InternalServerErrorException();
    }
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') param) {
    try {
      const userId = param as string;
      console.log(userId);
      return await this.platformService.findOne(userId);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
