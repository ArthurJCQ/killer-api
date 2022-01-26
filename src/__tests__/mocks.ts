import { EventEmitter2 } from '@nestjs/event-emitter';

export const eventEmitterMock = (): Partial<EventEmitter2> => {
  return {
    emit(): boolean {
      return true;
    },
  };
};
