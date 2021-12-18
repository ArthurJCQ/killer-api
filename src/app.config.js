"use strict";
exports.__esModule = true;
exports.databaseConfig = exports.appConfig = void 0;
var config_1 = require("@nestjs/config");
exports.appConfig = (0, config_1.registerAs)('app', function () { return ({
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    cookieSessionKey: process.env.COOKIE_SESSION_KEY
}); });
exports.databaseConfig = (0, config_1.registerAs)('database', function () { return ({
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    user: process.env.DATABASE_USER,
    port: process.env.DATABASE_PORT
}); });
