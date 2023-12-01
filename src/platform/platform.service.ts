import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Platforms } from './entities/platform.entity';
import { Repository } from 'typeorm';
import { Users } from '../user/entities/user.entity';

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(Platforms)
    private readonly platformRepository: Repository<Platforms>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async findMany(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const platforms = await this.platformRepository.find({
      where: {
        owner: user,
      },
    });

    if (!platforms) {
      throw new NotFoundException();
    }

    return {
      platforms,
    };
  }

  async update(updatePlatformDto: UpdatePlatformDto, email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return new NotFoundException();
    }

    const newPlatforms = updatePlatformDto.platforms.map((item) => {
      const platform = new Platforms();
      platform.owner = user;
      platform.id = item.id;
      platform.link = item.link;
      platform.title = item.title;
      return platform;
    });

    await this.platformRepository.delete({ owner: user });

    const insertResult = await this.platformRepository.save(newPlatforms);

    if (!insertResult) {
      return new BadRequestException();
    }
    return {
      message: '성공적으로 추가되었습니다.',
    };
  }

  async findOne(userId: string) {
    const platforms = await this.platformRepository.find({
      where: {
        owner: {
          id: +userId,
        },
      },
    });
    if (!platforms) {
      throw new NotFoundException();
    }
    return platforms;
  }
}
