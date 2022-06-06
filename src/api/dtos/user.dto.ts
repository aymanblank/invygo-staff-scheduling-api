import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsInt()
  @IsOptional()
  public roleId?: number;
}

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

export class FilterUserDto {
  @IsString()
  @IsOptional()
  public startDate: string;

  @IsString()
  @IsOptional()
  public endDate: string;

  @IsString()
  @IsOptional()
  public order: string;
}
