export class PlayerKilledEvent {
  constructor(
    public readonly playerId: number,
    public readonly targetId: number,
    public readonly missionId: number,
    public readonly roomCode: string,
  ) {}
}
