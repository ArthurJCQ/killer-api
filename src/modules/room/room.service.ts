import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import randomstring from 'randomstring';

import { PlayerModel } from '../player/player.model';
import { PlayerService } from '../player/player.service';
import { MercureEvent } from '../sse/models/mercure-event';

import { MAX_PLAYER_IN_ROOM, RoomStatus } from './constants';
import { PatchRoomPlayerDto } from './dtos/patch-room-player.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { GameStartingEvent } from './events/game-starting.event';
import { RoomModel } from './room.model';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomService {
  constructor(
    private roomRepo: RoomRepository,
    private playerService: PlayerService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createRoom({
    id,
    name,
    roomCode,
  }: Pick<PlayerModel, 'id' | 'name' | 'roomCode'>): Promise<RoomModel> {
    if (roomCode) {
      throw new BadRequestException({
        key: 'player.BAD_REQUEST.ALREADY_IN_ROOM',
      });
    }

    const newRoomCode = await this.generateRoomCode();

    return this.roomRepo.createRoom(newRoomCode, name, id);
  }

  async getRoomByCode(code: string): Promise<RoomModel> {
    const room = await this.roomRepo.getRoomByCode(code);

    if (!room) {
      throw new NotFoundException({ key: 'room.NOT_FOUND' });
    }

    return room;
  }

  async generateRoomCode(): Promise<string> {
    const roomCode = randomstring.generate({
      length: 5,
      capitalization: 'uppercase',
    });

    const existingRoom = await this.roomRepo.getRoomByCode(roomCode);

    if (existingRoom) {
      return this.generateRoomCode();
    }

    return roomCode;
  }

  async updateRoom(
    roomUpdateData: UpdateRoomDto,
    code: string,
  ): Promise<RoomModel> {
    const existingRoom = await this.roomRepo.getRoomByCode(code);

    if (!existingRoom) {
      throw new NotFoundException({ key: 'room.NOT_FOUND' });
    }

    if (existingRoom.status === RoomStatus.ENDED) {
      throw new BadRequestException({ key: 'room.WRONG_STATUS.ALREADY_ENDED' });
    }

    if (roomUpdateData.status === RoomStatus.IN_GAME) {
      if (existingRoom.status === RoomStatus.IN_GAME) {
        throw new BadRequestException({
          key: 'room.WRONG_STATUS.ALREADY_STARTED',
        });
      }

      await this.canStartGame(code);

      this.eventEmitter.emit('game.starting', new GameStartingEvent(code));
    }

    return this.roomRepo.updateRoom(roomUpdateData, code);
  }

  async getAllPlayersInRoom(code: string): Promise<PlayerModel[]> {
    const room = await this.roomRepo.getRoomByCode(code);

    if (!room) {
      throw new NotFoundException({ key: 'room.NOT_FOUND' });
    }

    return this.playerService.getAllPlayersInRoom(code);
  }

  async isPlayerInRoom(code: string, playerId: number): Promise<boolean> {
    const playersInRoom = await this.getAllPlayersInRoom(code);

    return playersInRoom.some((player) => player.id === playerId);
  }

  async patchRoomPlayerAdmin(
    { roomCode }: PatchRoomPlayerDto,
    playerId: number,
  ): Promise<void> {
    if (roomCode !== null) {
      throw new ForbiddenException({ key: 'room.FORBIDDEN' });
    }

    await this.playerService.updatePlayer({ roomCode }, playerId);
  }

  async enoughPlayersInRoom(code: string): Promise<boolean> {
    const playersInRoom = await this.getAllPlayersInRoom(code);

    if (playersInRoom.length <= MAX_PLAYER_IN_ROOM) {
      throw new BadRequestException({ key: 'room.NOT_ENOUGH_PLAYERS' });
    }

    return true;
  }

  async canStartGame(code: string): Promise<boolean> {
    const [enoughMissionsInRoom, allPlayersHavePasscode, enoughPlayersInRoom] =
      await Promise.all([
        this.playerService.checkIfEnoughMissionInRoom(code),
        this.playerService.checkAllPlayerInRoomHavePasscode(code),
        this.enoughPlayersInRoom(code),
      ]);

    return (
      enoughMissionsInRoom && allPlayersHavePasscode && enoughPlayersInRoom
    );
  }

  async deleteRoom(code: string): Promise<void> {
    const players = await this.getAllPlayersInRoom(code);

    /** Kick players one by one, as there are check and cleaning steps in updatePlayer method */
    for (const player of players) {
      await this.playerService.updatePlayer(
        { roomCode: null },
        player.id,
        false,
      );
    }

    await this.roomRepo.deleteRoom(code);

    this.eventEmitter.emit('push.mercure', new MercureEvent(`room/${code}`));
  }
}
