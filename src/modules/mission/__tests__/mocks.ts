import { MissionModel } from '../mission.model';
import { MissionRepository } from '../mission.repository';

export const missionRepositoryMock = (): Omit<MissionRepository, 'db'> => {
  const dummyMissions: MissionModel[] = [];

  return {
    async create(content: string, playerId: number): Promise<MissionModel> {
      const mission = {
        id: Math.floor(Math.random() * 99999),
        authorId: playerId,
        content,
      };

      dummyMissions.push(mission);

      return mission;
    },
  };
};
