import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseService } from '../../../database/database.service';
import { PlayerRole, PlayerStatus, RoomStatus } from '../../constants';
import { MissionRepository } from '../../repositories/mission.repository';
import { PlayerRepository } from '../../repositories/player.repository';
import { MissionService } from '../../services/mission.service';
import { PlayerKilledService } from '../../services/player-killed.service';
import { PlayerService } from '../../services/player.service';

describe('PlayerService', () => {
  let service: PlayerService;
  let playerRepo: PlayerRepository;
  let playerKilledService: PlayerKilledService;
  let missionService: MissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        PlayerService,
        PlayerRepository,
        PlayerKilledService,
        MissionService,
        EventEmitter2,
      ],
    })
      .useMocker((token) => {
        if (token === DatabaseService || MissionRepository) {
          return {};
        }
      })
      .compile();

    service = module.get(PlayerService);
    playerRepo = module.get(PlayerRepository);
    missionService = module.get(MissionService);
    playerKilledService = module.get(PlayerKilledService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a player', async () => {
    const expectedPlayer = {
      id: 1,
      name: 'Arty',
      roomCode: 'CODE1',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
    };

    const getRoomStatusSpy = jest.spyOn(playerRepo, 'getPlayerRoom');
    const getPlayerByNameInRoomSpy = jest.spyOn(
      playerRepo,
      'getPlayerByNameInRoom',
    );
    const createPlayerSpy = jest
      .spyOn(playerRepo, 'createPlayer')
      .mockResolvedValue(expectedPlayer);

    const player = await service.createPlayer({
      name: 'John',
    });

    expect(getRoomStatusSpy).not.toHaveBeenCalled();
    expect(getPlayerByNameInRoomSpy).not.toHaveBeenCalled();
    expect(createPlayerSpy).toHaveBeenCalledWith('John', undefined);
    expect(player).toBeDefined();
    expect(player).toEqual(expectedPlayer);
  });

  it('should create a player in an existing room', async () => {
    const expectedPlayer = {
      id: 1,
      name: 'Arty',
      roomCode: 'CODE1',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
    };

    const getRoomStatusSpy = jest
      .spyOn(playerRepo, 'getPlayerRoom')
      .mockResolvedValue({
        status: RoomStatus.PENDING,
        name: 'room',
        code: 'CODE1',
        createdAt: new Date(),
        dateEnd: new Date(),
      });
    const getPlayerByNameInRoomSpy = jest
      .spyOn(playerRepo, 'getPlayerByNameInRoom')
      .mockResolvedValue(null);
    const createPlayerSpy = jest
      .spyOn(playerRepo, 'createPlayer')
      .mockResolvedValue(expectedPlayer);

    const player = await service.createPlayer({
      name: 'John',
      roomCode: 'CODE1',
    });

    expect(getRoomStatusSpy).toHaveBeenCalledWith('CODE1');
    expect(getPlayerByNameInRoomSpy).toHaveBeenCalledWith('CODE1', 'John');
    expect(createPlayerSpy).toHaveBeenCalledWith('John', 'CODE1');
    expect(player).toBeDefined();
    expect(player).toEqual(expectedPlayer);
  });

  it('should prevent from creating a player in a not pending room', async () => {
    const getRoomStatusSpy = jest
      .spyOn(playerRepo, 'getPlayerRoom')
      .mockResolvedValue({
        status: RoomStatus.IN_GAME,
        name: 'room',
        code: 'CODE1',
        createdAt: new Date(),
        dateEnd: new Date(),
      });
    const getPlayerByNameInRoomSpy = jest.spyOn(
      playerRepo,
      'getPlayerByNameInRoom',
    );
    const createPlayerSpy = jest.spyOn(playerRepo, 'createPlayer');

    await expect(
      service.createPlayer({
        name: 'John',
        roomCode: 'CODE1',
      }),
    ).rejects.toThrowError(BadRequestException);

    expect(getRoomStatusSpy).toHaveBeenCalledWith('CODE1');
    expect(getPlayerByNameInRoomSpy).not.toHaveBeenCalled();
    expect(createPlayerSpy).not.toHaveBeenCalled();
  });

  it('should prevent from creating a player in a not existing room', async () => {
    const getRoomStatusSpy = jest
      .spyOn(playerRepo, 'getPlayerRoom')
      .mockResolvedValue({
        status: RoomStatus.PENDING,
        name: 'room',
        code: 'CODE1',
        createdAt: new Date(),
        dateEnd: new Date(),
      });
    const getPlayerByNameInRoomSpy = jest
      .spyOn(playerRepo, 'getPlayerByNameInRoom')
      .mockResolvedValue({
        id: 1,
        name: 'Arty',
        roomCode: 'CODE1',
        status: PlayerStatus.ALIVE,
        role: PlayerRole.PLAYER,
      });
    const createPlayerSpy = jest.spyOn(playerRepo, 'createPlayer');

    await expect(
      service.createPlayer({
        name: 'John',
        roomCode: 'CODE1',
      }),
    ).rejects.toThrowError(BadRequestException);

    expect(getRoomStatusSpy).toHaveBeenCalledWith('CODE1');
    expect(getPlayerByNameInRoomSpy).toHaveBeenCalledWith('CODE1', 'John');
    expect(createPlayerSpy).not.toHaveBeenCalled();
  });

  it('should return my player', async () => {
    const expectedPlayer = {
      id: 1,
      name: 'Arty',
      roomCode: 'CODE1',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
    };

    const playerDto = {
      name: 'Arty',
      passcode: '1234',
      roomCode: 'CODE1',
    };

    const getPlayerSpy = jest
      .spyOn(playerRepo, 'getPlayer')
      .mockResolvedValue(expectedPlayer);

    const player = await service.login(playerDto);

    expect(getPlayerSpy).toHaveBeenCalledWith(playerDto);
    expect(player).toBeDefined();
    expect(player).toEqual(expectedPlayer);
  });

  it('should not return unexisting player', async () => {
    const playerDto = {
      name: 'Arty',
      passcode: '1234',
      roomCode: 'CODE1',
    };

    const getPlayerSpy = jest
      .spyOn(playerRepo, 'getPlayer')
      .mockResolvedValue(null);

    await expect(service.login(playerDto)).rejects.toThrowError(
      NotFoundException,
    );

    expect(getPlayerSpy).toHaveBeenCalledWith(playerDto);
  });

  it('should return player by id', async () => {
    const expectedPlayer = {
      id: 1,
      name: 'Arty',
      roomCode: 'CODE1',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
    };
    const getPlayerSpy = jest
      .spyOn(playerRepo, 'getPlayerById')
      .mockResolvedValue(expectedPlayer);

    const player = await service.getPlayerById(1);

    expect(getPlayerSpy).toHaveBeenCalledWith(1);
    expect(player).toBeDefined();
    expect(player).toEqual(expectedPlayer);
  });

  it('should return player by targetId', async () => {
    const expectedPlayer = {
      id: 1,
      name: 'Arty',
      roomCode: 'CODE1',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
      targetId: 2,
    };
    const getPlayerByTargetSpy = jest
      .spyOn(playerRepo, 'getPlayerByTargetId')
      .mockResolvedValue(expectedPlayer);

    const player = await service.getPlayerByTargetId(2);

    expect(getPlayerByTargetSpy).toHaveBeenCalledWith(2);
    expect(player).toBeDefined();
    expect(player).toEqual(expectedPlayer);
  });

  it('should update a player', async () => {
    const expectedPlayer = {
      id: 1,
      name: 'Arty',
      roomCode: 'CODE1',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
    };

    const getPlayerSpy = jest
      .spyOn(playerRepo, 'getPlayerById')
      .mockResolvedValue(expectedPlayer);

    const updatePlayerSpy = jest
      .spyOn(playerRepo, 'updatePlayer')
      .mockResolvedValue({
        ...expectedPlayer,
        status: PlayerStatus.KILLED,
        passcode: '4567',
        name: 'Arthur',
      });

    const getPlayerNameByRoomSpy = jest
      .spyOn(playerRepo, 'getPlayerByNameInRoom')
      .mockResolvedValue(null);

    const handlePlayerKilled = jest
      .spyOn(playerKilledService, 'handlePlayerKilled')
      .mockResolvedValue(null);

    const player = await service.updatePlayer(
      {
        name: 'Arthur',
        passcode: '4567',
        status: PlayerStatus.KILLED,
      },
      1,
    );

    expect(getPlayerSpy).toHaveBeenCalledWith(1);
    expect(getPlayerNameByRoomSpy).toHaveBeenCalledWith('CODE1', 'Arthur');
    expect(updatePlayerSpy).toHaveBeenCalledWith(
      {
        name: 'Arthur',
        passcode: '4567',
        status: PlayerStatus.KILLED,
      },
      1,
    );
    expect(handlePlayerKilled).toHaveBeenCalledWith(expectedPlayer);
    expect(player).toBeDefined();
    expect(player).toEqual({
      ...expectedPlayer,
      status: PlayerStatus.KILLED,
      passcode: '4567',
      name: 'Arthur',
    });
  });

  it('should not update pseudo if already exists in room', async () => {
    const expectedPlayer = {
      id: 1,
      name: 'Arty',
      roomCode: 'CODE1',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
    };

    const alreadyExistsPlayer = {
      id: 2,
      name: 'Arty',
      roomCode: 'CODE1',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
    };

    const getPlayerSpy = jest
      .spyOn(playerRepo, 'getPlayerById')
      .mockResolvedValue(expectedPlayer);

    const updatePlayerSpy = jest.spyOn(playerRepo, 'updatePlayer');

    const getPlayerNameByRoomSpy = jest
      .spyOn(playerRepo, 'getPlayerByNameInRoom')
      .mockResolvedValue(alreadyExistsPlayer);

    await expect(
      service.updatePlayer(
        {
          name: 'Arthur',
          passcode: '4567',
          status: PlayerStatus.KILLED,
        },
        1,
      ),
    ).rejects.toThrowError(BadRequestException);

    expect(getPlayerSpy).toHaveBeenCalledWith(1);
    expect(getPlayerNameByRoomSpy).toHaveBeenCalledWith('CODE1', 'Arthur');
    expect(updatePlayerSpy).not.toHaveBeenCalled();
  });

  it('should not update pseudo if player is not in any room', async () => {
    const expectedPlayer = {
      id: 1,
      name: 'Arty',
      roomCode: null,
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
    };

    const getPlayerSpy = jest
      .spyOn(playerRepo, 'getPlayerById')
      .mockResolvedValue(expectedPlayer);

    const updatePlayerSpy = jest
      .spyOn(playerRepo, 'updatePlayer')
      .mockResolvedValue({
        ...expectedPlayer,
        status: PlayerStatus.KILLED,
        passcode: '4567',
        name: 'Arthur',
      });

    const getPlayerNameByRoomSpy = jest.spyOn(
      playerRepo,
      'getPlayerByNameInRoom',
    );

    const handlePlayerKilled = jest
      .spyOn(playerKilledService, 'handlePlayerKilled')
      .mockResolvedValue(null);

    const player = await service.updatePlayer(
      {
        name: 'Arthur',
        passcode: '4567',
        status: PlayerStatus.KILLED,
      },
      1,
    );

    expect(getPlayerSpy).toHaveBeenCalledWith(1);
    expect(getPlayerNameByRoomSpy).not.toHaveBeenCalled();
    expect(updatePlayerSpy).toHaveBeenCalledWith(
      {
        name: 'Arthur',
        passcode: '4567',
        status: PlayerStatus.KILLED,
      },
      1,
    );
    expect(handlePlayerKilled).toHaveBeenCalledWith(expectedPlayer);
    expect(player).toEqual({
      ...expectedPlayer,
      status: PlayerStatus.KILLED,
      passcode: '4567',
      name: 'Arthur',
    });
  });

  it('should not update not existing player', async () => {
    const getPlayerSpy = jest
      .spyOn(playerRepo, 'getPlayerById')
      .mockResolvedValue(null);

    const updatePlayerSpy = jest.spyOn(playerRepo, 'updatePlayer');

    await expect(
      service.updatePlayer(
        {
          name: 'Arthur',
          passcode: '4567',
        },
        -1,
      ),
    ).rejects.toThrowError(NotFoundException);

    expect(getPlayerSpy).toHaveBeenCalledWith(-1);
    expect(updatePlayerSpy).not.toHaveBeenCalled();
  });

  it('should return all players in room', async () => {
    const expectedPlayers = [
      {
        id: 1,
        name: 'Arty',
        roomCode: 'CODE1',
        status: PlayerStatus.ALIVE,
        role: PlayerRole.PLAYER,
      },
      {
        id: 2,
        name: 'John',
        roomCode: 'CODE1',
        status: PlayerStatus.ALIVE,
        role: PlayerRole.PLAYER,
      },
    ];

    const getAllPlayerSpy = jest
      .spyOn(playerRepo, 'getAllPlayersInRoom')
      .mockResolvedValue(expectedPlayers);

    const players = await service.getAllPlayersInRoom('CODE1');

    expect(getAllPlayerSpy).toHaveBeenCalledWith('CODE1');
    expect(players).toHaveLength(2);
    expect(players).toEqual(expectedPlayers);
  });

  // it('should return true if all player have passcode', async () => {
  //   const expectedPlayers = [
  //     {
  //       id: 1,
  //       name: 'Arty',
  //       roomCode: 'CODE1',
  //       passcode: '1234',
  //       status: PlayerStatus.ALIVE,
  //       role: PlayerRole.PLAYER,
  //     },
  //   ];
  //
  //   const getAllPlayerSpy = jest
  //     .spyOn(playerRepo, 'getAllPlayersInRoom')
  //     .mockResolvedValue(expectedPlayers);
  //
  //   const res = await service.checkAllPlayerInRoomHavePasscode('CODE1');
  //
  //   expect(getAllPlayerSpy).toHaveBeenCalledWith('CODE1');
  //   expect(res).toBeTruthy();
  // });

  // it('should return false if 1 player does not have passcode', async () => {
  //   const expectedPlayers = [
  //     {
  //       id: 1,
  //       name: 'Arty',
  //       roomCode: 'CODE1',
  //       status: PlayerStatus.ALIVE,
  //       role: PlayerRole.PLAYER,
  //     },
  //   ];
  //
  //   const getAllPlayerSpy = jest
  //     .spyOn(playerRepo, 'getAllPlayersInRoom')
  //     .mockResolvedValue(expectedPlayers);
  //
  //   await expect(
  //     service.checkAllPlayerInRoomHavePasscode('CODE1'),
  //   ).rejects.toThrowError(BadRequestException);
  //   expect(getAllPlayerSpy).toHaveBeenCalledWith('CODE1');
  // });

  it('should return true if there is enough mission in room', async () => {
    const expectedPlayers = [
      {
        id: 1,
        name: 'Arty',
        roomCode: 'CODE1',
        passcode: '1234',
        status: PlayerStatus.ALIVE,
        role: PlayerRole.PLAYER,
      },
    ];
    const expectedMissions = [
      {
        id: 1,
        content: 'Mission',
      },
    ];

    const getAllPlayerSpy = jest
      .spyOn(playerRepo, 'getAllPlayersInRoom')
      .mockResolvedValue(expectedPlayers);
    const getMissionsSpy = jest
      .spyOn(missionService, 'getMissions')
      .mockResolvedValue(expectedMissions);

    const res = await service.checkIfEnoughMissionInRoom('CODE1');

    expect(getAllPlayerSpy).toHaveBeenCalledWith('CODE1');
    expect(getMissionsSpy).toHaveBeenCalledWith('CODE1');
    expect(res).toBeTruthy();
  });

  it('should return false if there is not enough mission in room', async () => {
    const expectedPlayers = [
      {
        id: 1,
        name: 'Arty',
        roomCode: 'CODE1',
        status: PlayerStatus.ALIVE,
        role: PlayerRole.PLAYER,
      },
    ];

    const getAllPlayerSpy = jest
      .spyOn(playerRepo, 'getAllPlayersInRoom')
      .mockResolvedValue(expectedPlayers);
    const getMissionsSpy = jest
      .spyOn(missionService, 'getMissions')
      .mockResolvedValue([]);

    await expect(
      service.checkIfEnoughMissionInRoom('CODE1'),
    ).rejects.toThrowError(BadRequestException);
    expect(getAllPlayerSpy).toHaveBeenCalledWith('CODE1');
    expect(getMissionsSpy).toHaveBeenCalledWith('CODE1');
  });

  it('should delete user', async () => {
    const expectedPlayers = {
      id: 1,
      name: 'Arty',
      roomCode: 'CODE1',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
    };

    const getPlayerSpy = jest
      .spyOn(playerRepo, 'getPlayerById')
      .mockResolvedValue(expectedPlayers);
    const deletePlayerSpy = jest
      .spyOn(playerRepo, 'deletePlayer')
      .mockResolvedValue(true);

    await service.deletePlayer(1);

    expect(getPlayerSpy).toHaveBeenCalledWith(1);
    expect(deletePlayerSpy).toHaveBeenCalledWith(1);
  });

  it('should not delete not existing user', async () => {
    const getPlayerSpy = jest
      .spyOn(playerRepo, 'getPlayerById')
      .mockResolvedValue(null);
    const deletePlayerSpy = jest.spyOn(playerRepo, 'deletePlayer');

    await expect(service.getPlayerById(1)).rejects.toThrowError(
      NotFoundException,
    );
    expect(getPlayerSpy).toHaveBeenCalledWith(1);
    expect(deletePlayerSpy).not.toHaveBeenCalled();
  });
});
