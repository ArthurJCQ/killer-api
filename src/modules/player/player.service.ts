import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { MissionService } from '../mission/mission.service';
import { RoomStatus } from '../room/constants';

import { PlayerStatus } from './constants';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { GetMyPlayerDto } from './dtos/get-my-player.dto';
import { PlayerKilledEvent } from './events/player-killed-event';
import { PlayerModel } from './player.model';
import { PlayerRepository } from './player.repository';

@Injectable()
export class PlayerService {
  constructor(
    private playerRepo: PlayerRepository,
    private missionService: MissionService,
    private eventEmitter: EventEmitter2,
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
    return this.playerRepo.getPlayerById(id);
  }

  async getPlayerByTargetId(targetId: number): Promise<PlayerModel> {
    return this.playerRepo.getPlayerByTargetId(targetId);
  }

  async updatePlayer(
    player: Partial<PlayerModel>,
    id: number,
  ): Promise<PlayerModel> {
    const existingPlayer = await this.playerRepo.getPlayerById(id);

    if (!existingPlayer) {
      throw new NotFoundException('No player found to update');
    }

    const updatedPlayer = await this.playerRepo.updatePlayer(player, id);

    if (player.status === PlayerStatus.KILLED) {
      this.eventEmitter.emit(
        'player.killed',
        new PlayerKilledEvent(
          id,
          updatedPlayer.targetId,
          updatedPlayer.missionId,
        ),
      );
    }

    return updatedPlayer;
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
}
