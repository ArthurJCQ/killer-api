import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { RoomStatus } from '../room/constants';
import { RoomService } from '../room/room.service';

import { CreatePlayerDto } from './dtos/create-player.dto';
import { GetMyPlayerDto } from './dtos/get-my-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { PlayerModel } from './player.model';
import { PlayerRepository } from './player.repository';

@Injectable()
export class PlayerService {
  constructor(
    private playerRepo: PlayerRepository,
    private roomService: RoomService,
  ) {}

  async createPlayer({
    name,
    roomCode,
  }: CreatePlayerDto): Promise<PlayerModel> {
    if (roomCode) {
      const room = await this.roomService.getRoomByCode(roomCode);

      if (room.status !== RoomStatus.PENDING) {
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
}
