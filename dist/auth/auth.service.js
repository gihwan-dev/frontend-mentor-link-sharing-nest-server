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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hash_1 = require("./lib/hash");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../user/entities/user.entity");
let AuthService = exports.AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async getProfile({ email }) {
        try {
            if (!email) {
                return {
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: '잘못된 요청입니다. 로그인 후 다시 시도해 주세요.',
                };
            }
            const user = await this.userRepository.findOne({
                where: {
                    email,
                },
                select: ['id'],
            });
            if (!user) {
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: '해당 유저를 찾지 못했습니다. 로그아웃 후 다시 시도해 주세요.',
                };
            }
            return {
                statusCode: common_1.HttpStatus.ACCEPTED,
                id: user.id,
            };
        }
        catch (_a) {
            return {
                statusCode: common_1.HttpStatus.FORBIDDEN,
            };
        }
    }
    async signIn(findOneAuthDto) {
        try {
            const savedUser = await this.userRepository.findOne({
                where: {
                    email: findOneAuthDto.email,
                },
                select: ['password'],
            });
            if (!savedUser) {
                return {
                    message: '해당 유저가 존재하지 않습니다. 다시 시도해 주세요.',
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    access_token: null,
                };
            }
            const isValidPassword = await (0, hash_1.comparePassword)(findOneAuthDto.password, savedUser.password);
            if (!isValidPassword) {
                return {
                    message: '비밀번호가 일치하지 않습니다. 다시 시도해 주세요.',
                    statusCode: common_1.HttpStatus.UNAUTHORIZED,
                    access_token: null,
                };
            }
            const payload = { email: findOneAuthDto.email };
            const access_token = await this.jwtService.signAsync(payload);
            return {
                statusCode: common_1.HttpStatus.ACCEPTED,
                message: '로그인에 성공했습니다.',
                access_token: access_token,
            };
        }
        catch (e) {
            return {
                statusCode: common_1.HttpStatus.FORBIDDEN,
                message: '로그인에 실패했습니다. 다시시도해 주세요.',
                access_token: null,
            };
        }
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map