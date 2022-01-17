import { MissionModel } from '../mission.model';
import { MissionRepository } from '../mission.repository';
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

    async getMissionsByPlayer(playerId: number): Promise<MissionModel> {
      const { missionId } = dummyPlayerMissions.find(
        (playerMission) => playerMission.playerId === playerId,
      );

      const mission = dummyMissions.find((mission) => mission.id === missionId);

      return Promise.resolve(mission);
    },
  };
};
