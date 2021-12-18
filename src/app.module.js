"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var app_config_1 = require("./app.config");
var room_module_1 = require("./modules/room/room.module");
var player_module_1 = require("./modules/player/player.module");
var mission_module_1 = require("./modules/mission/mission.module");
var core_1 = require("@nestjs/core");
var database_module_1 = require("./modules/database/database.module");
// eslint-disable-next-line @typescript-eslint/no-var-requires
var cookieSession = require('cookie-session');
var AppModule = /** @class */ (function () {
    function AppModule(configService) {
        this.configService = configService;
    }
    AppModule.prototype.configure = function (consumer) {
        consumer
            .apply(cookieSession({
            keys: [this.configService.get('app.cookieSessionKey')]
        }))
            .forRoutes('*');
    };
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    load: [app_config_1.appConfig, app_config_1.databaseConfig],
                    isGlobal: true
                }),
                room_module_1.RoomModule,
                player_module_1.PlayerModule,
                mission_module_1.MissionModule,
                database_module_1.DatabaseModule,
            ],
            providers: [
                {
                    provide: core_1.APP_PIPE,
                    useValue: new common_1.ValidationPipe({
                        whitelist: true
                    })
                },
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
