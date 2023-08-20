import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { FindOneAuthDto } from './dto/findOne-auth.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getProfile(@Req() req, @Res() res: Response) {
    const result = await this.authService.getProfile(
      req['frontend-mentor-link-sharing'],
    );
    if (result.statusCode === HttpStatus.ACCEPTED) {
      return res.status(result.statusCode).json({ id: result.id });
    } else {
      return res.redirect('../login');
    }
  }

  @Post()
  async signIn(
    @Body() findOneAuthDto: FindOneAuthDto,
    @Res() response: Response,
  ) {
    try {
      const result = await this.authService.signIn(findOneAuthDto);
      console.log(result);
      if (result.access_token === null) {
        return response
          .status(result.statusCode)
          .json({ message: result.message });
      }
      return response
        .setHeader('Authorization', 'Bearer ' + result.access_token)
        .cookie('frontend-mentor-link-sharing', result.access_token, {
          maxAge: 60 * 60 * 1000,
          secure: true,
          sameSite: 'none',
          domain: 'frontend-mentor-link-sharing-next-front.vercel.app',
        })
        .status(result.statusCode)
        .json({ message: result.message });
    } catch (e) {
      return response
        .status(HttpStatus.FORBIDDEN)
        .json({ message: '로그인에 실패했습니다. 다시시도해 주세요.' });
    }
  }
}
