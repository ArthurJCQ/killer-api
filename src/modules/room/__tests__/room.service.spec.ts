import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseService } from '../../database/database.service';
import { PlayerRole, PlayerStatus } from '../../player/constants';
import { PlayerRepository } from '../../player/player.repository';
import { PlayerKilledService } from '../../player/services/player-killed.service';
import { PlayerService } from '../../player/services/player.service';
import { RoomStatus } from '../constants';
import { RoomRepository } from '../room.repository';
import { GameStartingService } from '../services/game-starting.service';
import { RoomService } from '../services/room.service';

describe('RoomService', () => {
  let service: RoomService;
  let roomRepo: RoomRepository;
  let playerService: PlayerService;
  let gameStartingService: GameStartingService;
  let eventEmmiter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        RoomRepository,
        PlayerService,
        PlayerKilledService,
        GameStartingService,
        EventEmitter2,
      ],
    })
      .useMocker((token) => {
        if (token === DatabaseService || PlayerRepository) {
          return {};
        }
      })
      .compile();

    service = module.get<RoomService>(RoomService);
    roomRepo = module.get<RoomRepository>(RoomRepository);
    playerService = module.get<PlayerService>(PlayerService);
    gameStartingService = module.get<GameStartingService>(GameStartingService);
    eventEmmiter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a room', async () => {
    const roomCode = 'CODE1';
    const expectedRoom = {
      id: 1,
      code: roomCode,
      status: RoomStatus.PENDING,
      createdAt: new Date(),
      name: 'room',
      dateEnd: new Date(),
    };

    const generateRoomCodeSpy = jest
      .spyOn(service, 'generateRoomCode')
      .mockResolvedValue(roomCode);
    const createRoomSpy = jest
      .spyOn(roomRepo, 'createRoom')
      .mockResolvedValue(expectedRoom);

    const room = await service.createRoom({
      id: 1,
      name: 'Arty',
      roomCode: '',
    });

    expect(generateRoomCodeSpy).toHaveBeenCalled();
    expect(createRoomSpy).toHaveBeenCalledWith(roomCode, 'Arty', 1);
    expect(room).toBeDefined();
    expect(room.code).toEqual(roomCode);
  });

  it('should generate a roomCode', async () => {
    const getRoomSpy = jest
      .spyOn(roomRepo, 'getRoomByCode')
      .mockResolvedValue(null);

    const roomCode = await service.generateRoomCode();

    expect(getRoomSpy).toHaveBeenCalled();
    expect(roomCode).toHaveLength(5);
  });

  it('should not create room for player already in a room', async () => {
    const generateRoomCodeSpy = jest.spyOn(service, 'generateRoomCode');
    const createRoomSpy = jest.spyOn(roomRepo, 'createRoom');

    await expect(
      service.createRoom({
        id: 1,
        name: 'Arty',
        roomCode: 'CODE1',
      }),
    ).rejects.toThrowError(BadRequestException);
    expect(generateRoomCodeSpy).not.toHaveBeenCalled();
    expect(createRoomSpy).not.toHaveBeenCalled();
  });

  it('should get a room', async () => {
    const expectedRoom = {
      id: 1,
      code: 'CODE1',
      status: RoomStatus.PENDING,
      createdAt: new Date(),
      name: 'room',
      dateEnd: new Date(),
    };

    const getRoomSpy = jest
      .spyOn(roomRepo, 'getRoomByCode')
      .mockResolvedValue(expectedRoom);

    const room = await service.getRoomByCode('CODE1');

    expect(getRoomSpy).toHaveBeenCalledWith('CODE1');
    expect(room).toBeDefined();
    expect(room).toEqual(expectedRoom);
  });

  it('should not get unexisting room', async () => {
    const getRoomSpy = jest
      .spyOn(roomRepo, 'getRoomByCode')
      .mockResolvedValue(null);

    await expect(service.getRoomByCode('CODE99')).rejects.toThrowError(
      NotFoundException,
    );
    expect(getRoomSpy).toHaveBeenCalledWith('CODE99');
  });

  it('should start a game', async () => {
    const expectedRoom = {
      id: 1,
      code: 'CODE1',
      status: RoomStatus.PENDING,
      createdAt: new Date(),
      name: 'room',
      dateEnd: new Date(),
    };

    const getRoomSpy = jest
      .spyOn(roomRepo, 'getRoomByCode')
      .mockResolvedValue(expectedRoom);
    const canStartGameSpy = jest
      .spyOn(service, 'canStartGame')
      .mockResolvedValue(true);
    const updateRoomSpy = jest
      .spyOn(roomRepo, 'updateRoom')
      .mockResolvedValue({ ...expectedRoom, status: RoomStatus.IN_GAME });
    const eventEmmitterSpy = jest
      .spyOn(eventEmmiter, 'emit')
      .mockImplementation();
    const handleGameStartingSpy = jest
      .spyOn(gameStartingService, 'handleGameStarting')
      .mockResolvedValue(null);

    const room = await service.updateRoom(
      { status: RoomStatus.IN_GAME },
      'CODE1',
    );

    expect(getRoomSpy).toHaveBeenCalledWith('CODE1');
    expect(canStartGameSpy).toHaveBeenCalledWith('CODE1');
    expect(handleGameStartingSpy).toHaveBeenCalledWith('CODE1');
    expect(updateRoomSpy).toHaveBeenCalledWith(
      { status: RoomStatus.IN_GAME },
      'CODE1',
    );
    expect(eventEmmitterSpy).toHaveBeenCalled();
    expect(room).toBeDefined();
    expect(room).toEqual({ ...expectedRoom, status: RoomStatus.IN_GAME });
  });

  it('should not start a game if player have no passcode', async () => {
    const checkPasscodeSpy = jest
      .spyOn(playerService, 'checkAllPlayerInRoomHavePasscode')
      .mockRejectedValue(new BadRequestException());
    const checkEnoughMissionSpy = jest
      .spyOn(playerService, 'checkIfEnoughMissionInRoom')
      .mockResolvedValue(true);
    const enoughPlayersSpy = jest
      .spyOn(service, 'enoughPlayersInRoom')
      .mockImplementation();

    await expect(service.canStartGame('CODE11')).rejects.toThrowError(
      BadRequestException,
    );

    expect(checkEnoughMissionSpy).toHaveBeenCalledWith('CODE11');
    expect(checkPasscodeSpy).toHaveBeenCalledWith('CODE11');
    expect(enoughPlayersSpy).toHaveBeenCalledWith('CODE11');
  });

  it('should get all players in room', async () => {
    const getRoomSpy = jest.spyOn(roomRepo, 'getRoomByCode').mockResolvedValue({
      code: 'CODE1',
      status: RoomStatus.PENDING,
      createdAt: new Date(),
      name: 'room',
      dateEnd: new Date(),
    });
    const getAllPlayersSpy = jest
      .spyOn(playerService, 'getAllPlayersInRoom')
      .mockResolvedValue([
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
      ]);

    const players = await service.getAllPlayersInRoom('CODE3');

    expect(getRoomSpy).toHaveBeenCalledWith('CODE3');
    expect(getAllPlayersSpy).toHaveBeenCalledWith('CODE3');
    expect(players.length).toEqual(2);
  });

  it('should delete room', async () => {
    const getAllPlayersInRoomSpy = jest
      .spyOn(service, 'getAllPlayersInRoom')
      .mockResolvedValue([
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
      ]);

    const updatePlayerSpy = jest
      .spyOn(playerService, 'updatePlayer')
      .mockResolvedValue(null);

    await service.deleteRoom('CODE1');

    expect(getAllPlayersInRoomSpy).toHaveBeenCalledWith('CODE1');
    expect(updatePlayerSpy).toHaveBeenCalledTimes(2);
  });
});
