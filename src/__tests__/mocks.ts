import { EventEmitter2 } from '@nestjs/event-emitter';

export const eventEmitterMock = (): Partial<EventEmitter2> => {
  return {
    emit(_: any, ...__): boolean {
      return true;
    },
  };
};
