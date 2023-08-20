"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platforms = exports.Users = void 0;
const user_entity_1 = require("../user/entities/user.entity");
Object.defineProperty(exports, "Users", { enumerable: true, get: function () { return user_entity_1.Users; } });
const platform_entity_1 = require("../platform/entities/platform.entity");
Object.defineProperty(exports, "Platforms", { enumerable: true, get: function () { return platform_entity_1.Platforms; } });
const entities = [user_entity_1.Users, platform_entity_1.Platforms];
exports.default = entities;
//# sourceMappingURL=index.js.map