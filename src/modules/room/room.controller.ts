import { Controller } from '@nestjs/common';
import { ROOM } from '../../../knex/constants';

@Controller(ROOM)
export class RoomController {}
