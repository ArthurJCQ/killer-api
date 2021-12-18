"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DatabaseService = void 0;
var common_1 = require("@nestjs/common");
var knex_1 = require("knex");
var DatabaseService = /** @class */ (function () {
    function DatabaseService(configService) {
        this.configService = configService;
        var isProdEnv = 'production' === configService.get('app.env');
        this.client = (0, knex_1["default"])({
            client: 'pg',
            version: '13',
            connection: isProdEnv
                ? configService.get('database.url')
                : {
                    host: configService.get('database.host'),
                    user: configService.get('database.user'),
                    password: configService.get('database.password'),
                    database: configService.get('database.name'),
                    port: parseInt(configService.get('database.port'), 10)
                }
        });
    }
    DatabaseService = __decorate([
        (0, common_1.Injectable)()
    ], DatabaseService);
    return DatabaseService;
}());
exports.DatabaseService = DatabaseService;
