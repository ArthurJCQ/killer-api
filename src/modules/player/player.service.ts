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
      const { status: roomStatus } = await this.playerRepo.getPlayerRoomStatus(
        roomCode,
      );

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

    return !!players.find((player) => player.passcode?.length === 4);
  }

  async checkIfEnoughMissionInRoom(roomCode: string): Promise<boolean> {
    const [missions, players] = await Promise.all([
      this.missionService.getMissions(roomCode),
      this.playerRepo.getAllPlayersInRoom(roomCode),
    ]);
    return missions.length >= players.length;
  }

  @OnEvent('game.starting')
  handleGameStarting(gameStarting: GameStartingEvent): void {
    this.dispatchMissions(gameStarting.roomCode);
    this.dispatchTargets(gameStarting.roomCode);
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
    const players = await this.playerRepo.getAllPlayersInRoom(roomCode);

    // TODO dispatch targets
  }
}
