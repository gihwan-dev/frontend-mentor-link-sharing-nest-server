import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(
    @Body() createAuthDto: CreateAuthDto,
    @Res() response: Response,
  ) {
    const result = await this.authService.create(createAuthDto);

    return response.status(result.statusCode).json({ message: result.message });
  }
}
