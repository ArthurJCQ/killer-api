import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { MissionService } from '../mission/mission.service';
import { RoomStatus } from '../room/constants';
import { MercureEvent } from '../sse/models/mercure-event';

import { PlayerRole, PlayerStatus } from './constants';
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
      await this.checkRoomBeforeJoining(roomCode, { name });
    }

    return this.playerRepo.createPlayer(name, roomCode);
  }

  async login(playerDto: GetMyPlayerDto): Promise<PlayerModel> {
    const player = await this.playerRepo.getPlayer(playerDto);

    if (!player) {
      throw new NotFoundException({ key: 'player.NOT_FOUND' });
    }

    return player;
  }

  async getPlayerById(id: number): Promise<PlayerModel> {
    const player = await this.playerRepo.getPlayerById(id);

    if (!player) {
      throw new NotFoundException({ key: 'player.NOT_FOUND' });
    }

    return player;
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
      throw new NotFoundException({ key: 'player.NOT_FOUND' });
    }

    if (player.name && existingPlayer.roomCode && !player.roomCode) {
      const existingPlayerWithSameNameInRoom =
        await this.playerRepo.getPlayerByNameInRoom(
          existingPlayer.roomCode,
          player.name,
        );

      if (
        existingPlayerWithSameNameInRoom &&
        existingPlayerWithSameNameInRoom.id !== id
      ) {
        throw new BadRequestException({ key: 'player.ALREADY_EXIST' });
      }
    }

    if (player.roomCode) {
      await this.checkRoomBeforeJoining(player.roomCode, existingPlayer);

      if (player.roomCode !== existingPlayer.roomCode) {
        player.role = PlayerRole.PLAYER;
      }
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

    this.pushUpdatePlayerToMercure(
      player?.roomCode,
      updatedPlayer?.roomCode,
      existingPlayer?.roomCode,
      updatedPlayer,
    );

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

    if (isSomePlayerHaveNoPasscode) {
      throw new BadRequestException({ key: 'player.BAD_REQUEST.NO_PASSCODE' });
    }

    return true;
  }

  async checkIfEnoughMissionInRoom(roomCode: string): Promise<boolean> {
    const [missions, players] = await Promise.all([
      this.missionService.getMissions(roomCode),
      this.playerRepo.getAllPlayersInRoom(roomCode),
    ]);

    if (missions?.length < players?.length) {
      throw new BadRequestException({
        key: 'player.BAD_REQUEST.NOT_ENOUGH_MISSION',
      });
    }

    return true;
  }

  async deletePlayer(playerId: number): Promise<void> {
    const player = await this.playerRepo.getPlayerById(playerId);

    if (!player) {
      throw new NotFoundException({ key: 'player.NOT_FOUND' });
    }

    await this.playerRepo.deletePlayer(playerId);
  }

  private pushUpdatePlayerToMercure(
    newRoomCode: string,
    roomCodeAfterUpdate: string,
    roomCodeBeforeUpdate: string,
    updatedPlayer: Partial<PlayerModel>,
  ): void {
    /**
     * Either:
     *  - Player has a new room code => join_room case
     *  - Player has still a roomCode after update => simply an update on another field
     *  - Player had a roomCode before update => left_room case
     */
    const roomCode = newRoomCode || roomCodeAfterUpdate || roomCodeBeforeUpdate;

    if (roomCode) {
      this.eventEmitter.emit(
        'push.mercure',
        new MercureEvent(`room/${roomCode}`, JSON.stringify(updatedPlayer)),
      );
    }

    // If player has a roomCode different than his previous one, send event to the previous room (a player left).
    if (roomCodeBeforeUpdate && roomCodeBeforeUpdate !== roomCode) {
      this.eventEmitter.emit(
        'push.mercure',
        new MercureEvent(
          `room/${roomCodeBeforeUpdate}`,
          JSON.stringify(updatedPlayer),
        ),
      );
    }
  }

  private async checkRoomBeforeJoining(
    roomCode: string,
    player: Partial<PlayerModel>,
  ): Promise<boolean> {
    const room = await this.playerRepo.getPlayerRoom(roomCode);

    if (!room) {
      throw new NotFoundException({
        key: 'room.NOT_FOUND',
      });
    }

    if (room.status !== RoomStatus.PENDING) {
      throw new BadRequestException({
        key: 'room.WRONG_STATUS.CREATE_PLAYER',
      });
    }

    const existingPlayer = await this.playerRepo.getPlayerByNameInRoom(
      roomCode,
      player.name,
    );

    if (existingPlayer && existingPlayer.id !== player.id) {
      throw new BadRequestException({ key: 'player.ALREADY_EXIST' });
    }

    return true;
  }
}
