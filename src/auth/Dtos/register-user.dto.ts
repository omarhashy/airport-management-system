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
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @IsAlpha()
  @Transform(({ value }) => value.trim())
  @Field()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @IsAlpha()
  @Transform(({ value }) => value.trim())
  @Field()
  lastName: string;

  @IsEmail()
  @Transform(({ value }) => value.trim())
  @Transform(({ value }) => value.trim())
  @Field()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(5)
  @IsAlphanumeric()
  @Transform(({ value }) => value.trim())
  @Field()
  password: string;

  @IsEnum(UserRole)
  @Field(() => UserRole, { nullable: true })
  role!: UserRole;
}
