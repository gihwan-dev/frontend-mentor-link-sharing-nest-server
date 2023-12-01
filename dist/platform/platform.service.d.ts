import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { Platforms } from './entities/platform.entity';
import { Repository } from 'typeorm';
import { Users } from '../user/entities/user.entity';
export declare class PlatformService {
    private readonly platformRepository;
    private readonly userRepository;
    constructor(platformRepository: Repository<Platforms>, userRepository: Repository<Users>);
    findMany(email: string): Promise<{
        platforms: Platforms[];
    }>;
    update(updatePlatformDto: UpdatePlatformDto, email: string): Promise<NotFoundException | BadRequestException | {
        message: string;
    }>;
    findOne(userId: string): Promise<Platforms[]>;
}
