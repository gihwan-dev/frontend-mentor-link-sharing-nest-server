import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Platform } from './entities/platform.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(Platform)
    private readonly platformRepository: Repository<Platform>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async update(updatePlatformDto: UpdatePlatformDto, email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return new NotFoundException();
      }

      const newPlatforms = updatePlatformDto.platforms.map((item) => {
        const platform = new Platform();
        platform.owner = user;
        platform.id = item.id;
        platform.link = item.link;
        platform.title = item.title;
        return platform;
      });

      const insertResult = this.platformRepository.save(newPlatforms);
    } catch (error) {}
  }
}
