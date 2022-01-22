import { PlayerRole, PlayerStatus } from '../../player/constants';
import { PlayerModel } from '../../player/player.model';
import { MissionModel } from '../mission.model';
import { MissionRepository } from '../mission.repository';
import { MissionService } from '../mission.service';
import { PlayerMissionModel } from '../player-mission.model';

export const missionRepositoryMock = (): Omit<MissionRepository, 'db'> => {
  const dummyMissions: MissionModel[] = [
    {
      id: 1,
      content: 'Push your friends in the stairs',
    },
  ];
  const dummyPlayerMissions: PlayerMissionModel[] = [
    {
      id: 1,
      missionId: 1,
      playerId: 1,
    },
  ];
  const dummyPlayers: PlayerModel[] = [
    {
      id: 1,
      missionId: 1,
      roomCode: 'CODE1',
      name: 'John',
      role: PlayerRole.PLAYER,
      status: PlayerStatus.ALIVE,
    },
  ];

  return {
    async create(content: string, playerId: number): Promise<MissionModel> {
      const mission = {
        id: Math.floor(Math.random() * 99999),
        content,
      };

      const playerMission = {
        id: Math.floor(Math.random() * 99999),
        playerId,
        missionId: mission.id,
      };

      dummyMissions.push(mission);
      dummyPlayerMissions.push(playerMission);

      return Promise.resolve(mission);
    },

    async getMissionsByPlayer(playerId: number): Promise<MissionModel[]> {
      const { missionId } = dummyPlayerMissions.find(
        (playerMission) => playerMission.playerId === playerId,
      );

      const mission = dummyMissions.filter(
        (mission) => mission.id === missionId,
      );

      return Promise.resolve(mission);
    },

    async getAllMissionsInRoom(roomCode: string): Promise<MissionModel[]> {
      const players = dummyPlayers.filter(
        (player) => player.roomCode === roomCode,
      );

      const playerMissions = [];

      players.forEach((player) => {
        playerMissions.push(
          dummyPlayerMissions.filter(
            (playerMission) => playerMission.playerId === player.id,
          ),
        );
      });

      const missions = [];

      playerMissions.forEach((playerMission) => {
        missions.push(
          missions.push(
            dummyMissions.filter(
              (mission) => playerMission.missionId === mission.id,
            ),
          ),
        );
      });

      return Promise.resolve(missions);
    },
  };
};

export const missionServiceMock = (): Partial<MissionService> => {
  return {
    async getAllMissionsInRoom(roomCode: string): Promise<MissionModel[]> {
      return missionRepositoryMock().getAllMissionsInRoom(roomCode);
    },
  };
};
