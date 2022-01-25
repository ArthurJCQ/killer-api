import { PlayerRole, PlayerStatus } from '../../player/constants';
import { PlayerModel } from '../../player/player.model';
import { MissionRoomModel } from '../mission-room.model';
import { MissionModel } from '../mission.model';
import { MissionRepository } from '../mission.repository';
import { MissionService } from '../mission.service';

export const missionRepositoryMock = (): Omit<MissionRepository, 'db'> => {
  const dummyMissions: MissionModel[] = [
    {
      id: 1,
      content: 'Push your friends in the stairs',
    },
  ];
  const dummyMissionsRoom: MissionRoomModel[] = [
    {
      id: 1,
      missionId: 1,
      roomCode: 'CODE1',
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
    async create(content: string, roomCode: string): Promise<MissionModel> {
      const mission = {
        id: Math.floor(Math.random() * 99999),
        content,
      };

      const playerMission = {
        id: Math.floor(Math.random() * 99999),
        roomCode,
        missionId: mission.id,
      };

      dummyMissions.push(mission);
      dummyMissionsRoom.push(playerMission);

      return Promise.resolve(mission);
    },

    async getMissions(roomCode: string): Promise<MissionModel[]> {
      const { missionId } = dummyMissionsRoom.find(
        (missionRoom) => missionRoom.roomCode === roomCode,
      );

      const mission = dummyMissions.filter(
        (mission) => mission.id === missionId,
      );

      return Promise.resolve(mission);
    },
  };
};

export const missionServiceMock = (): Partial<MissionService> => {
  return {
    async getMissions(roomCode: string): Promise<MissionModel[]> {
      return missionRepositoryMock().getMissions(roomCode);
    },
  };
};
