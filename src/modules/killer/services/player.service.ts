import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { MercureEvent } from '../../sse/models/mercure-event';
import { MercureEventType } from '../../sse/models/mercure-event-types';
import { PlayerRole, PlayerStatus, RoomStatus } from '../constants';
import { CreatePlayerDto } from '../dtos/create-player.dto';
import { GetMyPlayerDto } from '../dtos/get-my-player.dto';
import { PlayerModel } from '../models/player.model';
import { PlayerRepository } from '../repositories/player.repository';

import { MissionService } from './mission.service';
import { PlayerKilledService } from './player-killed.service';
import { PlayerLeaveRoomService } from './player-leave-room.service';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger();

  constructor(
    private playerRepo: PlayerRepository,
    private missionService: MissionService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => PlayerKilledService))
    private playerKilledService: PlayerKilledService,
    private playerLeaveRoomService: PlayerLeaveRoomService,
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
    updatingData: Partial<PlayerModel>,
    id: number,
    mercureEventType: MercureEventType = MercureEventType.PLAYER_UPDATED,
  ): Promise<PlayerModel> {
    this.logger.log(`Update player ${id}`);

    const player = await this.playerRepo.getPlayerById(id);

    if (!player) {
      throw new NotFoundException({ key: 'player.NOT_FOUND' });
    }

    /** Player update his name without leaving room */
    if (updatingData.name && player.roomCode && !updatingData.roomCode) {
      const existingPlayerWithSameNameInRoom =
        await this.playerRepo.getPlayerByNameInRoom(
          player.roomCode,
          updatingData.name,
        );

      if (
        existingPlayerWithSameNameInRoom &&
        existingPlayerWithSameNameInRoom.id !== id
      ) {
        throw new BadRequestException({ key: 'player.ALREADY_EXIST' });
      }
    }

    /** Admin can't become player without giving admin rights first. */
    if (
      updatingData.role === PlayerRole.PLAYER &&
      player.role === PlayerRole.ADMIN
    ) {
      throw new BadRequestException({
        key: 'player.FORBIDDEN.CHANGE_ADMIN',
      });
    }

    /** Player is joining room */
    if (updatingData.roomCode && updatingData.roomCode !== player.roomCode) {
      await this.checkRoomBeforeJoining(updatingData.roomCode, player);

      /** Player leave a room */
      if (player.roomCode) {
        await this.handlePlayerLeavingRoom(player);

        /** Player leaving room is considered as killed to keep game playable */
        if (player.targetId && player.missionId) {
          mercureEventType = MercureEventType.PLAYER_KILLED;
        }
      }

      updatingData.role = PlayerRole.PLAYER;
      updatingData.status = PlayerStatus.ALIVE;
    }

    /** Player is quitting room */
    if (updatingData.roomCode === null) {
      updatingData.role = PlayerRole.PLAYER;
      updatingData.status = PlayerStatus.ALIVE;

      await this.handlePlayerLeavingRoom(player);

      /** Player leaving room is considered as killed to keep game playable */
      if (player.targetId && player.missionId) {
        mercureEventType = MercureEventType.PLAYER_KILLED;
      }
    }

    /** Admin role transferring */
    if (
      updatingData.role === PlayerRole.ADMIN &&
      player.role === PlayerRole.PLAYER
    ) {
      await this.removeAdmin(player.roomCode);
    }

    const updatedPlayer = await this.playerRepo.updatePlayer(updatingData, id);

    if (updatingData.status === PlayerStatus.KILLED) {
      await this.playerKilledService.handlePlayerKilled(player);

      mercureEventType = MercureEventType.PLAYER_KILLED;
    }

    this.pushUpdatePlayerToMercure(
      updatingData?.roomCode,
      updatedPlayer?.roomCode,
      player?.roomCode,
      updatedPlayer,
      mercureEventType,
    );

    return updatedPlayer;
  }

  getAllPlayersInRoom(roomCode: string): Promise<PlayerModel[]> {
    return this.playerRepo.getAllPlayersInRoom(roomCode);
  }

  async checkAllPlayerInRoomHavePasscode(roomCode: string): Promise<boolean> {
    console.log(`Skipping passcode checking for room ${roomCode}`);

    /* To uncomment when adding passcode feature
    const players = await this.playerRepo.getAllPlayersInRoom(roomCode);

    const isSomePlayerHaveNoPasscode = players.some(
      ({ passcode }) => !passcode,
    );

    if (isSomePlayerHaveNoPasscode) {
      throw new BadRequestException({ key: 'player.BAD_REQUEST.NO_PASSCODE' });
    }
   */

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
    eventType?: MercureEventType,
  ): void {
    /**
     * Send event to roomCode if player is in room.
     * Either:
     *  - Player has a new room code => join_room case
     *  - Player has still a roomCode after update => simply an update on another field
     *  - Player had a roomCode before update => left_room case
     */
    const roomCode = newRoomCode || roomCodeAfterUpdate || roomCodeBeforeUpdate;

    if (roomCode) {
      this.eventEmitter.emit(
        'push.mercure',
        new MercureEvent(
          `room/${roomCode}`,
          JSON.stringify(updatedPlayer),
          eventType,
        ),
      );
    }

    // If player has a roomCode different from his previous one, send event to the previous room (a player left).
    if (roomCodeBeforeUpdate && roomCodeBeforeUpdate !== roomCode) {
      this.eventEmitter.emit(
        'push.mercure',
        new MercureEvent(
          `room/${roomCodeBeforeUpdate}`,
          JSON.stringify(updatedPlayer),
          eventType,
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

    this.logger.log(`Player ${player.id} can join room ${roomCode}`);

    return true;
  }

  async removeAdmin(roomCode: string): Promise<void> {
    const actualAdminPlayer = await this.playerRepo.getAdminPlayerRoom(
      roomCode,
    );

    if (!actualAdminPlayer) {
      throw new NotFoundException({ key: 'player.NOT_FOUND' });
    }

    this.logger.log(`Remove admin rights of player ${actualAdminPlayer.id}`);

    await this.playerRepo.updatePlayer(
      { role: PlayerRole.PLAYER },
      actualAdminPlayer.id,
    );
  }

  setMissionIdToPlayers(
    updatedPlayers: Pick<PlayerModel, 'id' | 'missionId'>[],
  ): Promise<void> {
    return this.playerRepo.setMissionIdToPlayers(updatedPlayers);
  }

  setTargetIdToPlayers(
    updatedPlayers: Pick<PlayerModel, 'id' | 'targetId'>[],
  ): Promise<void> {
    return this.playerRepo.setTargetIdToPlayers(updatedPlayers);
  }

  private async handlePlayerLeavingRoom(player: PlayerModel): Promise<void> {
    if (player.role === PlayerRole.ADMIN) {
      const roomPlayers = await this.playerRepo.getAllPlayersInRoom(
        player.roomCode,
      );

      const newAdmin = roomPlayers.find(
        (roomPlayer) => roomPlayer.id !== player.id,
      );

      /** Give admin right to the first other player found in room. */
      if (newAdmin) {
        await this.updatePlayer({ role: PlayerRole.ADMIN }, newAdmin.id);
      }
    }

    this.logger.log(`Player ${player.id} is leaving room`);

    await this.missionService.clearPlayerMissions(player);

    await this.playerLeaveRoomService.handlePlayerLeft(player);
  }
}
