"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const hash_1 = require("../auth/lib/hash");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_entity_1 = require("./entities/user.entity");
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_s3_1 = __importDefault(require("multer-s3"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const multer_1 = __importDefault(require("multer"));
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.uploadToS3 = (0, multer_1.default)({
            storage: (0, multer_s3_1.default)({
                s3: new client_s3_1.S3Client({
                    credentials: {
                        accessKeyId: process.env.S3_ACCESS_KEY,
                        secretAccessKey: process.env.S3_SECRET_KEY,
                    },
                    region: 'ap-northeast-2',
                }),
                contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
                bucket: process.env.S3_BUCKET_NAME,
                acl: 'public-read',
                key: function (request, file, cb) {
                    cb(null, `image/user/${Date.now().toString()}-${Math.random()
                        .toFixed()
                        .toString()}`);
                },
            }),
        }).array('image', 1);
        this.uploadPath = path.join(__dirname, '..', '..', 'images');
    }
    async findOne(email) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException();
        }
        const [firstName, lastName] = user.username.split(' ');
        return {
            firstName,
            lastName,
            email: user.contactEmail,
            image: user.image,
        };
    }
    async findOneUser(id) {
        const user = await this.userRepository.findOne({
            where: {
                id: id,
            },
            select: {
                email: true,
                contactEmail: true,
                image: true,
                username: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException();
        }
        console.log(user);
        return user;
    }
    async upload(req, res, email) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('유저 정보를 조회하는데 실패했습니다. 다시 시도해 주세요.');
        }
        this.uploadToS3(req, res, async (error) => {
            if (error) {
                console.log(error);
                throw new common_1.NotFoundException('이미지 갱신에 실패했습니다.');
            }
            const file = req.files[0];
            const imageUrl = file.location;
            await this.userRepository.update(user.id, {
                image: imageUrl,
            });
            res.status(201).json('이미지 갱신에 성공했습니다.');
        });
    }
    async updateOne(updateUserDto, jwt) {
        var _a;
        const user = await this.userRepository.findOne({
            where: {
                email: jwt.email,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('유저 정보가 존재하지 않습니다. 다시 로그인을 시도해 주세요.');
        }
        const updateUser = new update_user_dto_1.UpdateUserDto();
        updateUser.username = updateUserDto.username;
        updateUser.contactEmail = (_a = updateUserDto.contactEmail) !== null && _a !== void 0 ? _a : '';
        const updateResult = this.userRepository.update(user.id, updateUser);
        if (!updateResult) {
            throw new common_1.ForbiddenException('업데이트에 실패했습니다. 다시시도해 주세요.');
        }
        return {
            message: '성공적으로 업데이트 하였습니다.',
        };
    }
    async create(createUserDto) {
        var _a;
        try {
            const isExisting = await this.userRepository.findOne({
                where: {
                    email: createUserDto.email,
                },
            });
            if (isExisting) {
                return {
                    statusCode: common_1.HttpStatus.CONFLICT,
                    message: '이미 존재하는 이메일 입니다.',
                };
            }
            const hashedAuth = Object.assign({}, createUserDto);
            hashedAuth.password = await (0, hash_1.hashPassword)(createUserDto.password);
            const newUser = this.userRepository.create(Object.assign(Object.assign({}, hashedAuth), { email: hashedAuth.email }));
            const createResult = await this.userRepository.save(newUser);
            if (!createResult) {
                return {
                    statusCode: common_1.HttpStatus.FORBIDDEN,
                    message: '계정을 생성하는데 실패했습니다. 다시 시도해 주세요.',
                };
            }
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: '성공적으로 계정을 생성했습니다.',
            };
        }
        catch (e) {
            return {
                statusCode: common_1.HttpStatus.FORBIDDEN,
                message: (_a = e.message) !== null && _a !== void 0 ? _a : '계정을 생성하는데 실패했습니다. 다시 시도해 주세요.',
            };
        }
    }
    async getImage(email) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException();
        }
        const imagePath = path.join(this.uploadPath, `${user.id}` + '.jpg');
        if (!fs.existsSync(imagePath)) {
            throw new common_1.NotFoundException();
        }
        return imagePath;
    }
    async getImagePublic(id) {
        const imagePath = path.join(this.uploadPath, `${id}` + '.jpg');
        if (!fs.existsSync(imagePath)) {
            throw new common_1.NotFoundException();
        }
        return imagePath;
    }
};
exports.UserService = UserService;
__decorate([
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "upload", null);
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map