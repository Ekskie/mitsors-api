import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  googleToken: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsArray()
  @IsNotEmpty()
  userRoles: string[];
}
