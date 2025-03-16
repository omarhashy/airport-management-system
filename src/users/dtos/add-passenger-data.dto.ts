import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AddPassengerDataDto {
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  @Transform(({ value }) => value.trim())
  @Field()
  passportNumber: string;

  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  @Transform(({ value }) => value.trim())
  @Field()
  nationality: string;
}
