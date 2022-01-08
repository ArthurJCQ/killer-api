import { IsNumber, IsString, Length, Min, MinLength } from 'class-validator';

export class GetMyPlayerDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @Min(1000)
  passcode: number;

  @IsString()
  @Length(5)
  roomCode: string;
}
