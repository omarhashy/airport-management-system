import { UserRole } from 'src/enums/user-roles.enum';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEmail,
  IsAlpha,
  IsAlphanumeric,
  MinLength,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class registerUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @IsAlpha()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @IsAlpha()
  lastName: string;

  @IsEmail()
  @Transform(({ value }) => value.trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(5)
  @IsAlphanumeric()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
