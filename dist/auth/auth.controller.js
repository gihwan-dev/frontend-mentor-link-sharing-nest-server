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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const findOne_auth_dto_1 = require("./dto/findOne-auth.dto");
const auth_guard_1 = require("./auth.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async getProfile(req, res) {
        const result = await this.authService.getProfile(req['frontend-mentor-link-sharing']);
        if (result.statusCode === common_1.HttpStatus.ACCEPTED) {
            return res.status(result.statusCode).json({ id: result.id });
        }
        else {
            return res.redirect('../login');
        }
    }
    async signIn(findOneAuthDto, response) {
        try {
            const result = await this.authService.signIn(findOneAuthDto);
            if (result.access_token === null) {
                return response
                    .status(result.statusCode)
                    .json({ message: result.message });
            }
            return response
                .cookie('frontend-mentor-link-sharing', result.access_token, {
                path: '/',
                maxAge: 60 * 60 * 1000,
                secure: true,
                domain: 'link-sharing.gihwan-dev.com',
                httpOnly: true,
            })
                .status(result.statusCode)
                .json({
                message: result.message,
            });
        }
        catch (e) {
            return response
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: '로그인에 실패했습니다. 다시시도해 주세요.' });
        }
    }
    async signOut(req, res) {
        try {
            console.log('here');
            res
                .clearCookie('frontend-mentor-link-sharing')
                .json({ message: '로그아웃에 성공했습니다.' });
        }
        catch (e) {
            res.json({ message: '로그아웃에 실패했습니다. 다시 시도해 주세요.' });
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [findOne_auth_dto_1.FindOneAuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('signout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signOut", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map