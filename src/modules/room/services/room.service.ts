import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import randomstring from 'randomstring';

import { PlayerModel } from '../../player/player.model';
import { PlayerService } from '../../player/services/player.service';
import { MercureEvent } from '../../sse/models/mercure-event';
import { MercureEventType } from '../../sse/models/mercure-event-types';
import { MINIMUM_PLAYER_IN_ROOM, RoomStatus } from '../constants';
import { PatchRoomPlayerDto } from '../dtos/patch-room-player.dto';
import { UpdateRoomDto } from '../dtos/update-room.dto';
import { RoomModel } from '../room.model';
import { RoomRepository } from '../room.repository';

import { GameStartingService } from './game-starting.service';

@Injectable()
export class RoomService {
  private readonly logger = new Logger();

  constructor(
    private roomRepo: RoomRepository,
    private playerService: PlayerService,
    private eventEmitter: EventEmitter2,
    private gameStartingService: GameStartingService,
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
    let mercureEventType = MercureEventType.ROOM_UPDATED;
    const room = await this.roomRepo.getRoomByCode(code);

    if (!room) {
      throw new NotFoundException({ key: 'room.NOT_FOUND' });
    }

    if (room.status === RoomStatus.ENDED) {
      throw new BadRequestException({ key: 'room.WRONG_STATUS.ALREADY_ENDED' });
    }

    if (roomUpdateData.status === RoomStatus.IN_GAME) {
      if (room.status === RoomStatus.IN_GAME) {
        throw new BadRequestException({
          key: 'room.WRONG_STATUS.ALREADY_STARTED',
        });
      }

      await this.canStartGame(code);
      await this.gameStartingService.handleGameStarting(room.code);

      mercureEventType = MercureEventType.ROOM_IN_GAME;
    }

    const updatedRoom = await this.roomRepo.updateRoom(roomUpdateData, code);

    this.eventEmitter.emit(
      'push.mercure',
      new MercureEvent(`room/${code}`, JSON.stringify(room), mercureEventType),
    );

    return updatedRoom;
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

    if (playersInRoom.length < MINIMUM_PLAYER_IN_ROOM) {
      throw new BadRequestException({
        key: 'room.START_GAME.NOT_ENOUGH_PLAYERS',
      });
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

    const canStart =
      enoughMissionsInRoom && allPlayersHavePasscode && enoughPlayersInRoom;

    this.logger.log(`canStartGame = ${canStart} for ${code}`);

    return canStart;
  }

  async deleteRoom(code: string): Promise<void> {
    const players = await this.getAllPlayersInRoom(code);

    /** Kick players one by one, as there are check and cleaning steps in updatePlayer method */
    for (const player of players) {
      await this.playerService.updatePlayer(
        { roomCode: null },
        player.id,
        MercureEventType.NO_EVENT,
      );
    }

    this.logger.log(
      `All players in room ${code} were kicked before deleting it.`,
    );

    this.eventEmitter.emit(
      'push.mercure',
      new MercureEvent(`room/${code}`, null, MercureEventType.ROOM_DELETED),
    );
  }
}
