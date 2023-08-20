"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        origin: [
            'https://frontend-mentor-link-sharing-next-front.vercel.app',
            'http://localhost:3000',
        ],
    });
    app.use((0, cookie_parser_1.default)());
    await app.listen(8000);
}
bootstrap();
//# sourceMappingURL=main.js.map