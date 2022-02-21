import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import randomstring from 'randomstring';

import { PlayerModel } from '../player/player.model';
import { PlayerService } from '../player/player.service';

import { RoomStatus } from './constants';
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
      throw new BadRequestException('Player is already in a room');
    }

    const newRoomCode = await this.generateRoomCode();

    return this.roomRepo.createRoom(newRoomCode, name, id);
  }

  async getRoomByCode(code: string): Promise<RoomModel> {
    const room = await this.roomRepo.getRoomByCode(code);

    if (!room) {
      throw new NotFoundException('Room not found');
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
      throw new NotFoundException('No room found with this code');
    }

    if (existingRoom.status === RoomStatus.ENDED) {
      throw new BadRequestException('Can not update ended room');
    }

    if (roomUpdateData.status === RoomStatus.IN_GAME) {
      if (existingRoom.status === RoomStatus.IN_GAME) {
        throw new BadRequestException('Game already started');
      }

      const canStartGame = await this.canStartGame(code);

      if (!canStartGame) {
        throw new BadRequestException(
          'Game can not start. Either there is no enough mission, or some players did not set a passcode',
        );
      }

      this.eventEmitter.emit('game.starting', new GameStartingEvent(code));
    }

    return this.roomRepo.updateRoom(roomUpdateData, code);
  }

  async getAllPlayersInRoom(code: string): Promise<PlayerModel[]> {
    const room = await this.roomRepo.getRoomByCode(code);

    if (!room) {
      throw new NotFoundException('Room does not exist');
    }

    return this.playerService.getAllPlayersInRoom(code);
  }

  async enoughPlayersInRoom(code: string): Promise<boolean> {
    const playersInRoom = await this.getAllPlayersInRoom(code);

    if (playersInRoom.length <= 1) {
      throw new BadRequestException('There is not enough players in room.');
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
}
