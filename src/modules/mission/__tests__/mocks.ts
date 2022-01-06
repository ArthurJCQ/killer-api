import { MissionModel } from '../mission.model';
import { MissionRepository } from '../mission.repository';

export const missionRepositoryMock = (): Omit<MissionRepository, 'db'> => {
  const dummyMissions: MissionModel[] = [];
  const dummyPlayerMissions = [];

  return {
    async create(content: string, playerId: number): Promise<MissionModel> {
      const mission = {
        id: Math.floor(Math.random() * 99999),
        content,
      };

      const playerMission = {
        playerId,
        missionId: mission.id,
      };

      dummyMissions.push(mission);
      dummyPlayerMissions.push(playerMission);

      return Promise.resolve(mission);
    },
  };
};
