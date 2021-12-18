"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PlayerModule = void 0;
var common_1 = require("@nestjs/common");
var player_service_1 = require("./player.service");
var player_controller_1 = require("./player.controller");
var player_repository_1 = require("./player.repository");
var database_module_1 = require("../database/database.module");
var current_player_middleware_1 = require("./middlewares/current-player.middleware");
var PlayerModule = /** @class */ (function () {
    function PlayerModule() {
    }
    PlayerModule.prototype.configure = function (consumer) {
        consumer.apply(current_player_middleware_1.CurrentPlayerMiddleware).forRoutes('*');
    };
    PlayerModule = __decorate([
        (0, common_1.Module)({
            imports: [database_module_1.DatabaseModule],
            providers: [player_service_1.PlayerService, player_repository_1.PlayerRepository],
            controllers: [player_controller_1.PlayerController]
        })
    ], PlayerModule);
    return PlayerModule;
}());
exports.PlayerModule = PlayerModule;
