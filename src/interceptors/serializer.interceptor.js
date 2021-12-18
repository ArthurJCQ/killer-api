"use strict";
exports.__esModule = true;
exports.Serialize = void 0;
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var class_transformer_1 = require("class-transformer");
function Serialize(dto) {
    return (0, common_1.UseInterceptors)(new SerializerInterceptor(dto));
}
exports.Serialize = Serialize;
var SerializerInterceptor = /** @class */ (function () {
    function SerializerInterceptor(dto) {
        this.dto = dto;
    }
    SerializerInterceptor.prototype.intercept = function (context, next) {
        var _this = this;
        return next.handle().pipe((0, rxjs_1.map)(function (data) {
            return (0, class_transformer_1.plainToInstance)(_this.dto, data, {
                excludeExtraneousValues: true
            });
        }));
    };
    return SerializerInterceptor;
}());
