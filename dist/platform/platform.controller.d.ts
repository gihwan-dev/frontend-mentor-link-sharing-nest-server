import { InternalServerErrorException } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { UpdatePlatformDto } from './dto/update-platform.dto';
export declare class PlatformController {
    private readonly platformService;
    constructor(platformService: PlatformService);
    findMany(req: any): Promise<{
        platforms: import("./entities/platform.entity").Platforms[];
    } | InternalServerErrorException>;
    update(req: any, updatePlatformDto: UpdatePlatformDto): Promise<{
        message: string;
    }>;
    findOne(req: any, param: any): Promise<import("./entities/platform.entity").Platforms[]>;
}
