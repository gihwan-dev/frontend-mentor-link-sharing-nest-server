import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { FindOneAuthDto } from './dto/findOne-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async signIn(
    @Body() findOneAuthDto: FindOneAuthDto,
    @Res() response: Response,
  ) {
    try {
      const result = await this.authService.signIn(findOneAuthDto);
      if (result.access_token === null) {
        return response
          .status(result.statusCode)
          .json({ message: result.message });
      }
      return response
        .setHeader('Authorization', 'Bearer ' + result.access_token)
        .cookie('frontend-mentor-link-sharing', result.access_token, {
          domain: 'localhost',
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
          path: '/',
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
