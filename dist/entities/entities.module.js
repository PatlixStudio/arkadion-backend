"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitiesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const arkadion_entity_entity_1 = require("./arkadion-entity.entity");
const entities_service_1 = require("./entities.service");
const entities_controller_1 = require("./entities.controller");
let EntitiesModule = class EntitiesModule {
};
exports.EntitiesModule = EntitiesModule;
exports.EntitiesModule = EntitiesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([arkadion_entity_entity_1.ArkadionEntity])],
        controllers: [entities_controller_1.EntitiesController],
        providers: [entities_service_1.EntitiesService],
        exports: [entities_service_1.EntitiesService, typeorm_1.TypeOrmModule],
    })
], EntitiesModule);
//# sourceMappingURL=entities.module.js.map