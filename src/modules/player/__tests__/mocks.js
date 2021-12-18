"use strict";
exports.__esModule = true;
exports.playerRepositoryMock = void 0;
var constants_1 = require("../constants");
var playerRepositoryMock = function () {
    var dummyPlayers = [];
    return {
        createPlayer: function (name, passcode) {
            var player = {
                id: Math.floor(Math.random() * 999999),
                name: name,
                passcode: passcode,
                status: constants_1.PlayerStatus.ALIVE,
                role: constants_1.PlayerRole.PLAYER,
                roomId: 1
            };
            dummyPlayers.push(player);
            return Promise.resolve(player);
        },
        getPlayerByPseudo: function (name) {
            var user = dummyPlayers.find(function (player) { return player.name === name; });
            return Promise.resolve(user);
        }
    };
};
exports.playerRepositoryMock = playerRepositoryMock;
