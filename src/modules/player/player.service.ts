import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MissionService } from '../mission/mission.service';
import { RoomStatus } from '../room/constants';
import { GameStartingEvent } from '../room/events/game-starting.event';

import { CreatePlayerDto } from './dtos/create-player.dto';
import { GetMyPlayerDto } from './dtos/get-my-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { PlayerModel } from './player.model';
import { PlayerRepository } from './player.repository';

@Injectable()
export class PlayerService {
  constructor(
    private playerRepo: PlayerRepository,
    private missionService: MissionService,
  ) {}

  async createPlayer({
    name,
    roomCode,
  }: CreatePlayerDto): Promise<PlayerModel> {
    if (roomCode) {
      const roomStatus = await this.playerRepo.getPlayerRoomStatus(roomCode);

      if (roomStatus !== RoomStatus.PENDING) {
        throw new BadRequestException(
          'You can only create player in Pending Status Room',
        );
      }

      const existingPlayer = await this.playerRepo.getPlayerByNameInRoom(
        roomCode,
        name,
      );

      if (existingPlayer) {
        throw new BadRequestException(
          'Player with this pseudo already exists in this room',
        );
      }
    }

    return this.playerRepo.createPlayer(name, roomCode);
  }

  async login(playerDto: GetMyPlayerDto): Promise<PlayerModel> {
    const player = await this.playerRepo.getPlayer(playerDto);

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return player;
  }

  async getPlayerById(id: number): Promise<PlayerModel> {
    const player = await this.playerRepo.getPlayerById(id);

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return player;
  }

  async updatePlayer(
    player: UpdatePlayerDto,
    id: number,
  ): Promise<PlayerModel> {
    const existingPlayer = await this.playerRepo.getPlayerById(id);

    if (!existingPlayer) {
      throw new NotFoundException('No player found to update');
    }

    return this.playerRepo.updatePlayer(player, id);
  }

  getAllPlayersInRoom(roomCode: string): Promise<PlayerModel[]> {
    return this.playerRepo.getAllPlayersInRoom(roomCode);
  }

  async checkAllPlayerInRoomHavePasscode(roomCode: string): Promise<boolean> {
    const players = await this.playerRepo.getAllPlayersInRoom(roomCode);

    const isSomePlayerHaveNoPasscode = players.some(
      ({ passcode }) => !passcode,
    );

    return !isSomePlayerHaveNoPasscode;
  }

  async checkIfEnoughMissionInRoom(roomCode: string): Promise<boolean> {
    const [missions, players] = await Promise.all([
      this.missionService.getMissions(roomCode),
      this.playerRepo.getAllPlayersInRoom(roomCode),
    ]);

    return missions.length >= players.length;
  }

  async deletePlayer(playerId: number): Promise<void> {
    const player = await this.playerRepo.getPlayerById(playerId);

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    await this.playerRepo.deletePlayer(playerId);
  }

  @OnEvent('game.starting')
  async handleGameStarting(gameStarting: GameStartingEvent): Promise<void> {
    await this.dispatchMissions(gameStarting.roomCode);
    await this.dispatchTargets(gameStarting.roomCode);
  }

  private async dispatchMissions(roomCode: string): Promise<void> {
    const [players, missions] = await Promise.all([
      this.playerRepo.getAllPlayersInRoom(roomCode),
      this.missionService.getMissions(roomCode),
    ]);

    const updatedPlayers = players.reduce(
      (players: Pick<PlayerModel, 'id' | 'missionId'>[], player) => {
        const randomMissionIndex = Math.floor(Math.random() * missions.length);
        const mission = missions[randomMissionIndex];

        players.push({ id: player.id, missionId: mission.id });

        missions.splice(randomMissionIndex, 1);

        return players;
      },
      [],
    );

    return this.playerRepo.setMissionIdToPlayers(updatedPlayers);
  }

  private async dispatchTargets(roomCode: string): Promise<void> {
    const allPlayers = await this.playerRepo.getAllPlayersInRoom(roomCode);

    const targets = allPlayers.slice();

    const updatedPlayers = allPlayers.reduce(
      (players: Pick<PlayerModel, 'id' | 'targetId'>[], currentPlayer) => {
        const playerTargets = targets.filter(
          (target) =>
            target.id !== currentPlayer.id &&
            target.targetId !== currentPlayer.id,
        );

        const randomTargetIndex = Math.floor(
          Math.random() * playerTargets.length,
        );
        const target = playerTargets[randomTargetIndex];

        players.push({ id: currentPlayer.id, targetId: target.id });

        for (const key of Object.keys(targets)) {
          if (targets[key] === target) {
            targets.splice(parseInt(key), 1);
            break;
          }
        }

        allPlayers.forEach((player) => {
          if (player.id === currentPlayer.id) {
            player.targetId = target.id;
            return;
          }
        });

        return players;
      },
      [],
    );

    return this.playerRepo.setTargetIdToPlayers(updatedPlayers);
  }
}
