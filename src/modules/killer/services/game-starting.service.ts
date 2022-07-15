import { Injectable, Logger } from '@nestjs/common';

import { PlayerModel } from '../models/player.model';
import { PlayerRepository } from '../repositories/player.repository';

import { MissionService } from './mission.service';

@Injectable()
export class GameStartingService {
  private readonly logger = new Logger();

  constructor(
    private playerRepo: PlayerRepository,
    private missionService: MissionService,
  ) {}

  async handleGameStarting(roomCode: string): Promise<void> {
    await this.dispatchMissions(roomCode);
    await this.dispatchTargets(roomCode);

    this.logger.log(`Missions and targets dispatched for room ${roomCode}`);
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
