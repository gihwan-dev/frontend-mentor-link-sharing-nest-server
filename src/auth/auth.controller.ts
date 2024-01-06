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
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const result = await this.authService.signIn(findOneAuthDto);
      if (result.access_token === null) {
        return response
          .status(result.statusCode)
          .json({ message: result.message });
      }
      return response
        .cookie('frontend-mentor-link-sharing', result.access_token, {
          path: '/',
          sameSite: "none",
          secure: true,
          domain: 'azurewebsites.net',
          httpOnly: true,
        })
        .status(result.statusCode)
        .json({
          message: result.message,
        });
    } catch (e) {
      return response
        .status(HttpStatus.FORBIDDEN)
        .json({ message: '로그인에 실패했습니다. 다시시도해 주세요.' });
    }
  }

  @UseGuards(AuthGuard)
  @Get('signout')
  async signOut(@Req() req, @Res() res: Response) {
    try {
      console.log('here');
      res
        .clearCookie('frontend-mentor-link-sharing')
        .json({ message: '로그아웃에 성공했습니다.' });
    } catch (e) {
      res.json({ message: '로그아웃에 실패했습니다. 다시 시도해 주세요.' });
    }
  }
}
