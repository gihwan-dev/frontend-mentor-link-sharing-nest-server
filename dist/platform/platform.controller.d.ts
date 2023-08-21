import { InternalServerErrorException } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { UpdatePlatformDto } from './dto/update-platform.dto';
export declare class PlatformController {
    private readonly platformService;
    constructor(platformService: PlatformService);
    findMany(req: any): Promise<InternalServerErrorException | {
        platforms: import("./entities/platform.entity").Platforms[];
    }>;
    update(req: any, updatePlatformDto: UpdatePlatformDto): Promise<{
        message: string;
    }>;
}
