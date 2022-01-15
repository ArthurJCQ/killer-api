import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { roomServiceMock } from '../../room/__tests__/mocks';
import { RoomService } from '../../room/room.service';
import { PlayerRole, PlayerStatus } from '../constants';
import { PlayerRepository } from '../player.repository';
import { PlayerService } from '../player.service';

import { playerRepositoryMock } from './mocks';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: PlayerRepository,
          useValue: playerRepositoryMock(),
        },
        {
          provide: RoomService,
          useValue: roomServiceMock(),
        },
      ],
    }).compile();

    service = module.get(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a player', async () => {
    const player = await service.createPlayer({
      name: 'John',
    });
    expect(player).toBeDefined();
    expect(player.name).toEqual('John');
    expect(player.status).toEqual(PlayerStatus.ALIVE);
    expect(player.role).toEqual(PlayerRole.PLAYER);
  });

  it('should create a player in an existing room', async () => {
    const player = await service.createPlayer({
      name: 'John',
      roomCode: 'CODE1',
    });

    expect(player).toBeDefined();
    expect(player.name).toEqual('John');
    expect(player.roomCode).toEqual('CODE1');
  });

  it('should prevent from creating a player in a not pending room', async () => {
    await expect(
      service.createPlayer({
        name: 'John',
        roomCode: 'CODE2',
      }),
    ).rejects.toThrowError(BadRequestException);
  });

  it('should prevent from creating a player in a not existing room', async () => {
    await expect(
      service.createPlayer({
        name: 'John',
        roomCode: 'CODE3',
      }),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return my player', async () => {
    const player = await service.login({
      name: 'Arty',
      passcode: '1234',
      roomCode: 'CODE1',
    });

    expect(player).toBeDefined();
    expect(player.name).toEqual('Arty');
    expect(player.passcode).toEqual('1234');
  });

  it('should not return unexisting player', async () => {
    await expect(
      service.login({
        name: 'Arty',
        passcode: '1235',
        roomCode: 'CODE1',
      }),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return player by id', async () => {
    const player = await service.getPlayerById(1);

    expect(player).toBeDefined();
    expect(player.name).toEqual('Arty');
    expect(player.passcode).toEqual('1234');
  });

  it('should update a player', async () => {
    const player = await service.updatePlayer(
      {
        name: 'Arthur',
        passcode: '4567',
      },
      1,
    );

    expect(player).toBeDefined();
    expect(player.name).toEqual('Arthur');
    expect(player.passcode).toEqual('4567');
  });

  it('should not update unexisting player', async () => {
    await expect(
      service.updatePlayer(
        {
          name: 'Arthur',
          passcode: '4567',
        },
        -1,
      ),
    ).rejects.toThrowError(NotFoundException);
  });
});
