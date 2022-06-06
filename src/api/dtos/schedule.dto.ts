import { IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  public date: string;

  @IsInt()
  public shiftLength: number;

  @IsInt()
  @IsOptional()
  public userId: number;
}

export class FilterScheduleDto {
  @IsString()
  @IsOptional()
  public startDate: string;

  @IsString()
  @IsOptional()
  public endDate: string;

  @IsNumberString()
  @IsOptional()
  public userId: number;
}
