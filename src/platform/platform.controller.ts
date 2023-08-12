import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @UseGuards(AuthGuard)
  @Patch()
  async update(@Req() req, @Body() updatePlatformDto: UpdatePlatformDto) {
    const jwt = req['frontend-mentor-link-sharing'];
    try {
      const result = await this.platformService.update(
        updatePlatformDto,
        jwt.email,
      );
    } catch (error) {}
  }
}
