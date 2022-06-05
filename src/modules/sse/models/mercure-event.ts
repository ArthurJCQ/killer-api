import { MercureEventType } from './mercure-event-types';

export class MercureEvent {
  constructor(
    public topic: string,
    public data?: string,
    public type?: MercureEventType,
  ) {}
}
