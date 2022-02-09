import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString, Length, MinLength } from 'class-validator';

export class GetMyPlayerDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty()
  @IsNumberString()
  @Length(4)
  passcode: string;

  @ApiProperty()
  @IsString()
  @Length(5)
  roomCode: string;
}
