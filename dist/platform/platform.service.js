"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const platform_entity_1 = require("./entities/platform.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
let PlatformService = class PlatformService {
    constructor(platformRepository, userRepository) {
        this.platformRepository = platformRepository;
        this.userRepository = userRepository;
    }
    async findMany(email) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException();
        }
        const platforms = await this.platformRepository.find({
            where: {
                owner: user,
            },
        });
        if (!platforms) {
            throw new common_1.NotFoundException();
        }
        return {
            platforms,
        };
    }
    async update(updatePlatformDto, email) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            return new common_1.NotFoundException();
        }
        const newPlatforms = updatePlatformDto.platforms.map((item) => {
            const platform = new platform_entity_1.Platforms();
            platform.owner = user;
            platform.id = item.id;
            platform.link = item.link;
            platform.title = item.title;
            return platform;
        });
        await this.platformRepository.delete({ owner: user });
        const insertResult = await this.platformRepository.save(newPlatforms);
        if (!insertResult) {
            return new common_1.BadRequestException();
        }
        return {
            message: '성공적으로 추가되었습니다.',
        };
    }
    async findOne(userId) {
        console.log(userId);
        return {
            message: 'success',
        };
    }
};
exports.PlatformService = PlatformService;
exports.PlatformService = PlatformService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(platform_entity_1.Platforms)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PlatformService);
//# sourceMappingURL=platform.service.js.map