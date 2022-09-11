import { Injectable, Logger } from '@nestjs/common';

import { MissionService } from '../../mission/mission.service';
import { PlayerService } from '../../player/services/player.service';

@Injectable()
export class GameStartingService {
  private readonly logger = new Logger();

  constructor(
    private playerService: PlayerService,
    private missionService: MissionService,
  ) {}

  async handleGameStarting(roomCode: string): Promise<void> {
    await this.dispatchTargets(roomCode);
    await this.dispatchMissions(roomCode);

    this.logger.log(`Missions and targets dispatched for room ${roomCode}`);
  }

  private async dispatchMissions(roomCode: string): Promise<void> {
    const [players, missions] = await Promise.all([
      this.playerService.getAllPlayersInRoom(roomCode),
      this.missionService.getMissions(roomCode),
    ]);

    const playersWithMissionCount = players
      .reduce((acc, player) => {
        const playerMission = {
          nbMissions: missions.filter(
            (mission) => mission.authorId === player.id,
          ).length,
          ...player,
        };

        acc.push(playerMission);

        return acc;
      }, [])
      .sort((player1, player2) => player2.nbMissions - player1.nbMissions);

    const updatedPlayers = [];

    for (const player of playersWithMissionCount) {
      const possibleMissions = missions.filter(
        (mission) => mission.authorId !== player.targetId,
      );

      // Get mission for player among possible missions array
      const randomMissionIndex = Math.floor(
        Math.random() * possibleMissions.length,
      );
      const missionForPlayer = possibleMissions[randomMissionIndex];

      // Fetch corresponding mission in all missions array and delete it
      const missionIndexInAllMissions = missions.indexOf(missionForPlayer);
      missions.splice(missionIndexInAllMissions, 1);

      updatedPlayers.push({ id: player.id, missionId: missionForPlayer.id });
    }

    return this.playerService.setMissionIdToPlayers(updatedPlayers);
  }

  private async dispatchTargets(roomCode: string): Promise<void> {
    const allPlayers = (
      await this.playerService.getAllPlayersInRoom(roomCode)
    ).sort(() => Math.random() - 0.5);

    const targets = allPlayers.map((player, index) => ({
      ...player,
      targetId: allPlayers[index + 1]?.id ?? allPlayers[0].id,
    }));

    await this.playerService.setTargetIdToPlayers(targets);
  }
}
