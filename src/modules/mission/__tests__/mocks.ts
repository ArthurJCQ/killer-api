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
    {
      id: 2,
      content: 'Push your friends in the stairs',
    },
    {
      id: 3,
      content: 'Push your friends in the stairs',
    },
    {
      id: 4,
      content: 'Push your friends in the stairs',
    },
  ];
  const dummyMissionsRoom: MissionRoomModel[] = [
    {
      id: 1,
      missionId: 1,
      authorId: 1,
      roomCode: 'CODE1',
    },
    {
      id: 2,
      missionId: 2,
      authorId: 1,
      roomCode: 'CODE2',
    },
    {
      id: 3,
      missionId: 3,
      authorId: 2,
      roomCode: 'CODE11',
    },
    {
      id: 4,
      missionId: 3,
      authorId: 2,
      roomCode: 'CODE12',
    },
  ];

  return {
    async create(
      content: string,
      roomCode: string,
      playerId: number,
    ): Promise<MissionModel> {
      const mission = {
        id: Math.floor(Math.random() * 99999),
        content,
      };

      const playerMission = {
        id: Math.floor(Math.random() * 99999),
        roomCode,
        authorId: playerId,
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

    async getMissionsByPlayerId(playerId: number): Promise<MissionModel[]> {
      const missionsRoom = dummyMissionsRoom.filter(
        (missionRoom) => missionRoom.authorId === playerId,
      );

      const missions = [];

      missionsRoom.forEach((missionRoom) => {
        const mission = dummyMissions.find(
          (mission) => mission.id === missionRoom.missionId,
        );

        missions.push(mission);
      });

      return Promise.resolve(missions);
    },

    async updateMission(
      missionId: number,
      missionContent: string,
    ): Promise<MissionModel> {
      const mission = dummyMissions.find(
        (dummyMission) => dummyMission.id === missionId,
      );

      mission.content = missionContent;

      return Promise.resolve(mission);
    },

    deleteMission(missionId): Promise<void> {
      dummyMissions.forEach((mission, index) => {
        if (mission.id === missionId) {
          dummyMissions.splice(index, 1);
          return;
        }
      });

      return Promise.resolve();
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
