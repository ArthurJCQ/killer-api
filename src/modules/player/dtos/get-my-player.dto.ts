import { IsNumberString, IsString, Length, MinLength } from 'class-validator';

export class GetMyPlayerDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumberString()
  @Length(4)
  passcode: string;

  @IsString()
  @Length(5)
  roomCode: string;
}
